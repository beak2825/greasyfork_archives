// ==UserScript==
// @name         115分享页一键转存按钮 (终极UI优化版)
// @version      7.8
// @description  全UI重构：底部居中动态冰晶呼吸按钮，完全透明高斯模糊设置面板，开关为海浪冰晶动效。优化转存速度，脚本加载后即刻检查并尝试自动转存。
// @author       楠 (UI：雨)
// @match        *://115cdn.com/s/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @icon         https://115.com/favicon.ico
// @namespace    https://greasyfork.org/users/1514724
// @downloadURL https://update.greasyfork.org/scripts/557710/115%E5%88%86%E4%BA%AB%E9%A1%B5%E4%B8%80%E9%94%AE%E8%BD%AC%E5%AD%98%E6%8C%89%E9%92%AE%20%28%E7%BB%88%E6%9E%81UI%E4%BC%98%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557710/115%E5%88%86%E4%BA%AB%E9%A1%B5%E4%B8%80%E9%94%AE%E8%BD%AC%E5%AD%98%E6%8C%89%E9%92%AE%20%28%E7%BB%88%E6%9E%81UI%E4%BC%98%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BOUNDARY_PX = 20;

    // --- I. 样式注入 (CSS 修复了动画冲突) ---
    function injectGlobalStyles() {
        if (document.getElementById('tm-master-style')) return;
        
        const style = document.createElement('style');
        style.id = 'tm-master-style';
        style.textContent = `
            @keyframes tm-flow-light { 
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
            @keyframes tm-ice-flow { 
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            @keyframes tm-ice-breathe { 
                0% { 
                    /* transform: translateX(-50%) scale(1);  由JS的tm-fade-in-bouncy控制X轴位置 */
                    box-shadow: 0 0 10px rgba(0, 191, 255, 0.6); 
                }
                50% { 
                    /* transform: translateX(-50%) scale(1.02); */
                    box-shadow: 0 0 25px rgba(0, 255, 255, 0.8);
                }
                100% { 
                    /* transform: translateX(-50%) scale(1); */
                    box-shadow: 0 0 10px rgba(0, 191, 255, 0.6); 
                }
            }
            @keyframes tm-toast-pulse { 
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.03); }
            }
            @keyframes tm-ocean-wave { 
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            @keyframes tm-neon-flow { 
                0% { background-position: 0% 50%; }
                100% { background-position: 100% 50%; }
            }
            @keyframes tm-shadow-light { 
                0% { box-shadow: 0 0 10px rgba(0, 162, 255, 0.4); }
                50% { box-shadow: 0 0 15px rgba(0, 162, 255, 0.7); }
                100% { box-shadow: 0 0 10px rgba(0, 162, 255, 0.4); }
            }
            @keyframes tm-fade-in-bouncy { 
                0% { opacity: 0; transform: translate(-50%, -10px) scale(0.9); }
                80% { opacity: 1; transform: translate(-50%, 0) scale(1.02); }
                100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
            }
            @keyframes tm-fade-out { 
                from { opacity: 1; transform: translate(-50%, 0) scale(1); }
                to { opacity: 0; transform: translate(-50%, -10px) scale(0.9); }
            }
            .tm-capsule-btn, .tm-capsule-input, .tm-capsule-toggle {
                border-radius: 30px;
                overflow: hidden;
                position: relative;
                transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                border: none;
                cursor: pointer;
                box-sizing: border-box;
                font-weight: 500;
            }
            .tm-vortex-btn {
                background: linear-gradient(-45deg, #000428, #004e92, #000428); 
                background-size: 300% 300%;
                color: #fff !important;
                animation: tm-ocean-wave 8s infinite ease-in-out;
                box-shadow: 0 4px 15px rgba(0, 78, 146, 0.5); 
            }
            .tm-vortex-btn:hover {
                box-shadow: 0 6px 20px rgba(0, 78, 146, 0.7);
            }
            .tm-electric-btn {
                background: linear-gradient(90deg, #1C92D2, #00FFFF, #1C92D2); 
                background-size: 200% 100%;
                color: #000 !important;
                animation: tm-neon-flow 2s infinite linear; 
                box-shadow: 0 4px 15px rgba(28, 146, 210, 0.5);
            }
            .tm-electric-btn:hover {
                box-shadow: 0 6px 20px rgba(28, 146, 210, 0.7);
            }
            .tm-electric-btn.disabled,
            #tm-folder-back.disabled { 
                background: #444 !important; 
                animation: none !important;
                box-shadow: none !important;
                color: #999 !important; 
                cursor: not-allowed !important; 
                opacity: 0.8;
            }
            .tm-ghost-btn {
                background: rgba(0, 0, 0, 0.4); 
                color: #fff !important;
                border: 1px solid rgba(0, 162, 255, 0.3);
                animation: tm-shadow-light 3s infinite alternate;
            }
            .tm-ghost-btn:hover {
                background: rgba(0, 0, 0, 0.6);
                box-shadow: 0 0 20px rgba(0, 162, 255, 0.7);
                transform: translateY(-1px);
            }
            .tm-success-bg {
                 background: linear-gradient(90deg, #00C6FF 0%, #0072FF 50%, #00C6FF 100%);
                 background-size: 200% 100%;
                 animation: tm-ice-flow 3s infinite linear; 
                 color: #fff !important;
                 box-shadow: 0 4px 15px rgba(0, 114, 255, 0.5); 
            }
            .tm-success-bg:hover {
                box-shadow: 0 6px 20px rgba(0, 114, 255, 0.7); 
            }
            #tm-settings-btn {
                position: fixed; 
                bottom: ${BOUNDARY_PX}px; 
                left: 50%;
                transform: translateX(-50%); 
                width: 160px; 
                height: 45px; 
                padding: 10px 20px;
                font-size: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                
                background: linear-gradient(90deg, #6DD5FA 0%, #2980B9 25%, #6DD5FA 50%, #2980B9 75%, #6DD5FA 100%); 
                background-size: 200% 100%; 
                color: #fff !important;
                animation: tm-ice-breathe 4s infinite ease-in-out, tm-neon-flow 8s infinite linear; 
                
                box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                cursor: pointer; 
                font-weight: bold; 
            }
            #tm-settings-btn:hover {
                box-shadow: 0 0 30px rgba(0, 255, 255, 1);
            }
            
            /* 优化：设置面板的背景设为完全透明，仅保留模糊背景 */
            #tm-settings-modal {
                background: transparent; /* 移除背景色 */
                backdrop-filter: blur(10px); 
                display: flex;
                justify-content: center;
                align-items: center; 
            }
            .tm-modal-content {
                background: transparent !important; 
                box-shadow: none; /* 移除阴影 */
                transform-origin: center center; 
                transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
                opacity: 0;
                transform: scale(0.1); 
                
                border-radius: 15px;
                border: none; /* 移除边框 */
                padding: 20px 25px;
                width: 260px !important;
            }
            .tm-modal-content.show {
                opacity: 1;
                transform: scale(1); 
            }
            .tm-modal-content h3 {
                text-align: center;
                background: none; 
                color: #fff; 
                -webkit-background-clip: unset;
                background-clip: unset;
                animation: none; 
                margin-bottom: 10px !important; 
                font-size: 18px;
                text-shadow: 0 0 5px rgba(0, 0, 0, 0.5); 
            }
            .tm-control-block {
                padding: 5px 0; 
                background: transparent !important; 
                border: none !important; 
                box-shadow: none !important; 
                margin-bottom: 5px; 
            }
            .tm-control-block label {
                display:block;
                margin-bottom:5px;
                color:#fff; 
                text-shadow: 0 0 5px rgba(0,0,0,0.8);
                font-size: 13px;
            }
            .tm-input-wrapper {
                position: relative;
                display: flex;
                align-items: center;
                height: 38px;
                margin-bottom: 5px; 
            }
            .tm-capsule-input {
                flex-grow: 1;
                width: 100%;
                padding: 0 15px;
                padding-right: 90px; 
                height: 100%;
                /* 输入框背景颜色略微保留，以区分和背景 */
                background: rgba(0, 0, 0, 0.15); 
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: #fff;
                font-size: 13px; 
            }
            .tm-input-btn {
                position: absolute;
                right: 5px;
                height: 30px;
                margin: 0;
                padding: 0 12px;
                font-size: 12px; 
                font-weight: bold;
                color: #fff;
                z-index: 10;
            }
            .tm-toggle-group {
                display: flex;
                flex-direction: row; 
                gap: 8px; 
                padding: 0;
                border: none;
                margin-top: 10px; 
                margin-bottom: 20px; 
            }
            .tm-capsule-toggle {
                flex: 1; 
                padding: 8px 10px;
                /* 开关背景保留略微透明的颜色，以区分状态 */
                background-color: rgba(255, 255, 255, 0.35); 
                color: #fff; 
                font-weight: 500;
                height: 38px; 
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); 
            }
            .tm-capsule-toggle.active {
                font-weight: bold;
            }
            
            /* 新增 Toast 样式 */
            #tm-dynamic-toast {
                background: linear-gradient(90deg, #6DD5FA 0%, #2980B9 25%, #6DD5FA 50%, #2980B9 75%, #6DD5FA 100%); 
                background-size: 200% 100%; 
                color: #fff;
                padding: 10px 15px !important; 
                border-radius: 30px !important; 
                border: none !important;
                backdrop-filter: blur(8px);
                transition: none;
            }
            .tm-toast-error { 
                background: linear-gradient(90deg, #D32F2F 0%, #FF5252 50%, #D32F2F 100%);
                background-size: 200% 100%; 
            }
            .tm-toast-content {
                color: #fff;
                text-shadow: 0 0 5px rgba(0,0,0,0.5);
            }
            .tm-toast-content a {
                background: rgba(0,0,0,0.3) !important;
                border: 1px solid rgba(255,255,255,0.2);
            }

            @media (max-width: 600px) {
                #tm-settings-btn {
                    width: 140px; 
                    height: 40px;
                    font-size: 14px;
                    bottom: ${BOUNDARY_PX * 0.8}px; 
                }
                .tm-modal-content {
                    width: 90% !important; 
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // --- II. 灵动胶囊通知气泡 ---
    function showDynamicToast(message, isSuccess = false, cid = 0) {
        const existingToast = document.querySelector('#tm-dynamic-toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.id = 'tm-dynamic-toast';
        const isError = message.includes('❌') || message.includes('⚠️') || !isSuccess;
        const duration = isSuccess ? 10000 : 5000;
        
        let iconHTML;
        let title;
        
        if (isSuccess) {
            iconHTML = '✓';
            title = '转存成功';
        } else if (isError) {
            iconHTML = '⚠️';
            title = '转存失败/警告';
            toast.classList.add('tm-toast-error');
        } else {
            iconHTML = 'ℹ️';
            title = '通知';
        }

        Object.assign(toast.style, {
            position: 'fixed',
            top: '8%', 
            left: '50%',
            transform: 'translateX(-50%)', 
            opacity: '0',
            transition: 'none', 
            zIndex: 10003,
            maxWidth: '280px', 
            minWidth: '120px', 
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 0 15px rgba(0, 191, 255, 0.8)',
        });
        
        if (isError) {
             toast.style.boxShadow = '0 0 15px rgba(255, 82, 82, 0.8)';
        }

        toast.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                <div class="tm-toast-content" style="display: flex; align-items: center; line-height: 1.2;">
                    <span class="tm-toast-icon" style="font-size: 14px; font-weight: bold; margin-right: 8px; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; border-radius: 50%; 
                        background-color: rgba(255,255,255,0.2); 
                    ">${iconHTML}</span>
                    <div style="display: flex; flex-direction: column;">
                        <span style="font-weight: bold; font-size: 12px; margin-bottom: 0px;">${title}</span>
                        <span style="font-size: 10px; color: #eee;">${message}</span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(toast);
        
        toast.style.animation = `
            tm-fade-in-bouncy 0.5s forwards, 
            tm-ice-breathe 4s infinite ease-in-out 0.5s, 
            tm-neon-flow 8s infinite linear 0.5s
        `;
        
        // 退出动画
        setTimeout(() => {
            toast.style.animation = 'tm-fade-out 0.5s forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 500);
        }, duration);
    }
    
    function showToast(message, cid) {
        const isSuccess = message.includes('✅') && !message.includes('失败') && !message.includes('已选择');
        showDynamicToast(message.replace('✅ ', '').replace('❌ ', '').replace('⚠️ ', '').replace('ℹ️ ', ''), isSuccess, cid);
    }
    
    // --- III. API 调用函数 ---
    async function getFolders(cid = 0) {
        const cookie = GM_getValue('cookie');
        if (!cookie) {
            showToast('⚠️ 请先设置Cookie');
            return [];
        }
        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://webapi.115.com/files?aid=1&cid=${cid}&show_dir=1&nsprefix=1`,
                    headers: {
                        "Cookie": cookie,
                        "User-Agent": "Mozilla/5.0"
                    },
                    onload: resolve,
                    onerror: reject
                });
            });

            const data = JSON.parse(response.responseText);
            if (data.state && data.data) {
                return data.data
                    .filter(item => item.fl && item.fl.length === 0)
                    .map(item => ({
                        name: item.n,
                        cid: item.cid
                    }));
            }
            return [];
        } catch (error) {
            console.error(error);
            showToast('❌ 获取文件夹列表失败');
            return [];
        }
    }

    // --- IV. 设置面板模态框 ---
    function showSettingsModal() {
        const btn = document.querySelector('#tm-settings-btn');
        if (!btn) return;

        if (document.querySelector('#tm-settings-modal')) {
            closeSettingsModal();
            return;
        }

        const cookie = GM_getValue('cookie') || '';
        const cid = GM_getValue('target_cid') || '';
        const copyLinkEnabled = GM_getValue('copy_link_enabled', false);
        const autoCopyEnabled = GM_getValue('auto_copy_enabled', false);

        const overlay = document.createElement('div');
        overlay.id = 'tm-settings-modal';
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: 10001,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0,
            transition: 'opacity 0.3s ease'
        });
        
        const modal = document.createElement('div');
        modal.className = 'tm-modal-content';
        modal.id = 'tm-settings-content'; 
        
        modal.innerHTML = `
            <h3>115 转存助手</h3> 
            
            <div class="tm-control-block">
                <label>Cookie:</label>
                <div class="tm-input-wrapper">
                    <input id="tm-cookie-input" type="password" value="${cookie}" class="tm-capsule-input" placeholder="请输入 115 Cookie">
                    <button id="tm-toggle-cookie" class="tm-capsule-btn tm-input-btn tm-electric-btn" style="width: 60px;">显示</button>
                </div>
            </div>
            
            <div class="tm-control-block">
                <label>目标文件夹 CID:</label>
                <div class="tm-input-wrapper">
                    <input id="tm-cid-input" type="text" value="${cid}" class="tm-capsule-input" placeholder="请输入目标文件夹 CID">
                    <button id="tm-browse-folders" class="tm-capsule-btn tm-input-btn tm-vortex-btn" style="width: 60px;">浏览</button>
                </div>
            </div>

            <div class="tm-toggle-group">
                <button id="tm-auto-copy-toggle" class="tm-capsule-toggle ${autoCopyEnabled ? 'active tm-success-bg' : ''}">
                    自动转存
                </button>
                <button id="tm-copy-link-toggle" class="tm-capsule-toggle ${copyLinkEnabled ? 'active tm-success-bg' : ''}">
                    复制链接
                </button>
            </div>

            <div style="text-align:center;">
                <button id="tm-settings-cancel" class="tm-capsule-btn tm-ghost-btn" style="margin-right:15px;padding:8px 25px;">取消</button>
                <button id="tm-settings-save" class="tm-capsule-btn tm-vortex-btn" style="padding:8px 25px;">保存</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        requestAnimationFrame(() => {
            overlay.style.opacity = 1;
            modal.classList.add('show');
        });

        const cookieInput = overlay.querySelector('#tm-cookie-input');
        const toggleCookieBtn = overlay.querySelector('#tm-toggle-cookie');
        const autoToggleBtn = overlay.querySelector('#tm-auto-copy-toggle');
        const linkToggleBtn = overlay.querySelector('#tm-copy-link-toggle');
        
        toggleCookieBtn.addEventListener('click', function() {
            if (cookieInput.type === 'password') {
                cookieInput.type = 'text';
                this.textContent = '隐藏';
            } else {
                cookieInput.type = 'password';
                this.textContent = '显示';
            }
        });

        autoToggleBtn.addEventListener('click', function() { 
            const wasActive = this.classList.contains('active');
            this.classList.toggle('active'); 
            this.classList.toggle('tm-success-bg');
            
            if (!wasActive) {
                showToast('✅ 自动转存功能已开启，访问带密码的分享链接将自动转存');
            } else {
                showToast('ℹ️ 自动转存功能已关闭');
            }
        });
        linkToggleBtn.addEventListener('click', function() { 
            const wasActive = this.classList.contains('active');
            this.classList.toggle('active'); 
            this.classList.toggle('tm-success-bg');
            
            if (!wasActive) {
                showToast('✅ 复制链接功能已开启，转存成功后将复制文件链接');
            } else {
                showToast('ℹ️ 复制链接功能已关闭');
            }
        });

        overlay.querySelector('#tm-browse-folders').addEventListener('click', () => {
            const cookieValue = document.querySelector('#tm-cookie-input').value.trim();
            GM_setValue('cookie', cookieValue);
            showFolderBrowser();
        });

        overlay.querySelector('#tm-settings-cancel').addEventListener('click', closeSettingsModal);

        overlay.querySelector('#tm-settings-save').addEventListener('click', () => {
            const newCookie = document.querySelector('#tm-cookie-input').value.trim();
            const newCid = document.querySelector('#tm-cid-input').value.trim();
            const copyLinkEnabled = document.querySelector('#tm-copy-link-toggle').classList.contains('active');
            const autoCopyEnabled = document.querySelector('#tm-auto-copy-toggle').classList.contains('active');

            GM_setValue('cookie', newCookie);
            GM_setValue('target_cid', newCid);
            GM_setValue('copy_link_enabled', copyLinkEnabled);
            GM_setValue('auto_copy_enabled', autoCopyEnabled);
            
            showToast('✅ 设置已保存');
            closeSettingsModal();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeSettingsModal();
            }
        });
    }

    function closeSettingsModal() {
        const overlay = document.querySelector('#tm-settings-modal');
        const modal = document.querySelector('#tm-settings-content');
        if (overlay && modal) {
            modal.classList.remove('show');
            overlay.style.opacity = 0;
            setTimeout(() => {
                overlay.remove();
            }, 400); 
        }
    }

    // --- V. 文件夹浏览器 (优化：背景、阴影、边框移除) ---
    async function showFolderBrowser() {
        if (document.querySelector('#tm-folder-browser')) return;

        const overlay = document.createElement('div');
        overlay.id = 'tm-folder-browser';
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'transparent', /* 移除背景色 */
            backdropFilter: 'blur(5px)',
            zIndex: 10002,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        });

        const modal = document.createElement('div');
        Object.assign(modal.style, {
            background: 'transparent', /* 移除背景色 */
            backdropFilter: 'none', /* 移除模糊 */
            padding: '25px',
            borderRadius: '15px',
            width: '500px',
            maxWidth: '90%', 
            maxHeight: '80vh',
            boxShadow: 'none', /* 移除阴影 */
            fontFamily: 'Arial, sans-serif',
            display: 'flex',
            flexDirection: 'column'
        });
        
        modal.innerHTML = `
            <h3 style="margin-top:0;margin-bottom:15px;color:#fff; text-align: center; text-shadow: 0 0 5px rgba(0,0,0,0.5);">浏览文件夹</h3>
            
            <div style="margin-bottom:15px;">
                <div class="tm-input-wrapper" style="margin-bottom: 0;">
                    <div id="tm-current-path" class="tm-capsule-input" style="display:flex; align-items:center; color:#fff; padding-right: 5px;">根目录</div>
                    <button id="tm-folder-back" class="tm-capsule-btn tm-input-btn tm-electric-btn disabled" style="width: 60px; right: 2px;">返回</button>
                </div>
            </div>
            
            <div id="tm-folders-list" style="flex:1;overflow-y:auto;margin-bottom:20px;min-height:200px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); padding: 5px; color: #fff;">
                <div style="text-align:center;padding:40px 0;">加载中...</div>
            </div>
            
            <div style="display:flex;justify-content:center; gap: 15px;">
                <button id="tm-folder-cancel" class="tm-capsule-btn tm-ghost-btn" style="padding:8px 25px;">取消</button>
                <button id="tm-folder-select" class="tm-capsule-btn tm-vortex-btn" style="padding:8px 25px;">选择当前文件夹</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        let currentCid = 0;
        let currentPath = ["根目录"];
        let cidStack = [];
        let pathStack = [];

        async function loadFolders(cid = 0) {
            const foldersList = document.getElementById('tm-folders-list');
            foldersList.innerHTML = '<div style="text-align:center;padding:40px 0;">加载中...</div>';

            const folders = await getFolders(cid);

            if (folders.length === 0) {
                foldersList.innerHTML = '<div style="text-align:center;padding:40px 0;color:#ccc;">该目录下没有文件夹</div>';
                return;
            }

            foldersList.innerHTML = '';
            folders.forEach(folder => {
                const folderItem = document.createElement('div');
                folderItem.className = 'tm-folder-item';
                folderItem.style.padding = '10px';
                folderItem.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
                folderItem.style.cursor = 'pointer';
                folderItem.style.display = 'flex';
                folderItem.style.justifyContent = 'space-between';
                folderItem.style.transition = 'background-color 0.2s';
                folderItem.innerHTML = `
                    <span>📁 ${folder.name}</span>
                    <span style="color:#ccc; font-size: 12px;">CID: ${folder.cid}</span>
                `;
                folderItem.onmouseover = () => folderItem.style.backgroundColor = 'rgba(255,255,255,0.1)';
                folderItem.onmouseout = () => folderItem.style.backgroundColor = 'transparent';


                folderItem.addEventListener('click', () => {
                    cidStack.push(currentCid);
                    pathStack.push([...currentPath]);
                    currentCid = folder.cid;
                    currentPath.push(folder.name);
                    updatePathDisplay();
                    loadFolders(currentCid);
                });

                foldersList.appendChild(folderItem);
            });
        }

        function updatePathDisplay() {
            const pathElement = document.getElementById('tm-current-path');
            pathElement.textContent = currentPath.join(' / ');
            const backBtn = document.getElementById('tm-folder-back');
            if (cidStack.length === 0) {
                backBtn.classList.add('disabled');
            } else {
                backBtn.classList.remove('disabled'); 
            }
        }

        document.getElementById('tm-folder-back').addEventListener('click', () => {
            const backBtn = document.getElementById('tm-folder-back');
            if (backBtn.classList.contains('disabled')) return;
            
            if (cidStack.length > 0) {
                currentCid = cidStack.pop();
                currentPath = pathStack.pop();
                updatePathDisplay();
                loadFolders(currentCid);
            }
        });

        document.getElementById('tm-folder-cancel').addEventListener('click', () => { overlay.remove(); });

        document.getElementById('tm-folder-select').addEventListener('click', () => {
            if (currentCid !== 0) {
                const cidInput = document.querySelector('#tm-cid-input');
                if (cidInput) { cidInput.value = currentCid; }
                showToast(`✅ 已选择目标文件夹`);
            }
            overlay.remove();
        });

        loadFolders(currentCid);
        updatePathDisplay();
    }

    // --- VI. 悬浮按钮 ---
    function addSettingsButton() {
        if (document.querySelector('#tm-settings-btn')) return;

        const btn = document.createElement('div');
        btn.id = 'tm-settings-btn';
        btn.textContent = '115转存助手'; 
        
        Object.assign(btn.style, {
            position: 'fixed', 
            zIndex: 10000,
            color: '#fff',
        });
        btn.className = 'tm-capsule-btn';

        document.body.appendChild(btn);
        
        btn.addEventListener('click', (e) => {
            showSettingsModal();
        });
    }
    
    // --- VII. 核心转存逻辑 ---
    function copyTo115() {
        const cookie = GM_getValue('cookie');
        const target_cid = GM_getValue('target_cid');

        if (!cookie) {
            showToast('⚠️ 请先设置Cookie');
            return;
        }
        if (!target_cid) {
            showToast('⚠️ 请先设置目标文件夹CID');
            return;
        }

        const share_link = location.href;
        const share_code_match = share_link.match(/\/s\/([^?]+)/);
        const password_match = share_link.match(/password=([^&]{4})/);
        
        if (!share_code_match || !password_match) {
            return;
        }

        const share_code = share_code_match[1];
        const receive_code = password_match[1];
        
        showToast('ℹ️ 正在尝试转存文件...');

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://webapi.115.com/share/receive",
            headers: {
                "Cookie": cookie,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: `share_code=${encodeURIComponent(share_code)}&receive_code=${encodeURIComponent(receive_code)}&cid=${encodeURIComponent(target_cid)}&is_check=0`,
            onload: function(response) {
                try {
                    const responseData = JSON.parse(response.responseText);

                    if (responseData.errno === 4100024) {
                        showToast('⚠️ 你已经转存过该文件');
                    } else if (responseData.state === true) {
                        // 复制链接逻辑（如果开启）
                        if (GM_getValue('copy_link_enabled', false)) {
                            navigator.clipboard.writeText(`https://115.com/?cid=${target_cid}&mode=wangpan`).then(() => {
                                showToast('✅ 转存成功！并已复制网盘链接到剪贴板。', target_cid); 
                            }).catch(() => {
                                showToast('✅ 转存成功！(复制链接失败)', target_cid); 
                            });
                        } else {
                            showToast('✅ 转存成功！', target_cid); 
                        }
                    } else {
                        showToast('❌ 转存失败: ' + (responseData.error || response.responseText));
                    }
                } catch (e) {
                    showToast('❌ 响应解析失败: ' + response.responseText);
                    console.error('Response parse error:', e, response.responseText);
                }
            },
            onerror: function(error) {
                showToast('❌ 转存接口调用失败');
                console.error(error);
            }
        });
    }

    function checkAndAutoCopy() {
        const autoCopyEnabled = GM_getValue('auto_copy_enabled', false);
        const share_link = location.href;
        const password_match = share_link.match(/password=([^&]{4})/);

        if (autoCopyEnabled && password_match) {
            copyTo115(); 
        } else if (autoCopyEnabled && !password_match) {
            showToast('ℹ️ 自动转存已开启，请先输入访问密码');
        }
    }
    
    function addCustomButton() {
        const codeConfirm = document.querySelector('#js-code_confirm');
        if (codeConfirm && !document.querySelector('#tm-copy-save-confirm')) {
            const button = document.createElement('a');
            button.id = 'tm-copy-save-confirm';
            button.className = codeConfirm.className;
            button.innerHTML = '<span>一键转存</span>';
            button.style.backgroundColor = '#4CAF50';
            button.style.color = '#fff';
            button.style.borderColor = '#4CAF50';
            button.style.marginTop = '10px';
            button.style.display = 'block'; 
            button.style.cursor = 'pointer';
            button.addEventListener('click', copyTo115);
            codeConfirm.parentNode.insertBefore(button, codeConfirm.nextSibling);
        }
        const shareSave2 = document.querySelector('#js-share_save2');
        if (shareSave2 && !document.querySelector('#tm-copy-save-share2')) {
            const button = shareSave2.cloneNode(true);
            button.id = 'tm-copy-save-share2';
            button.removeAttribute('href');
            button.removeAttribute('onclick');
            button.textContent = '一键转存';
            button.style.backgroundColor = '#4CAF50';
            button.color = '#fff';
            button.style.borderColor = '#4CAF50';
            button.style.marginRight = '10px';
            button.addEventListener('click', copyTo115);
            shareSave2.parentNode.insertBefore(button, shareSave2);
        }
        const original2 = document.querySelector('a[btn="save"]');
        if (original2 && !document.querySelector('#tm-copy-save-btn2')) {
            const button = document.createElement('a');
            button.id = 'tm-copy-save-btn2';
            button.className = original2.className;
            button.innerHTML = `<i class="icon-operate ifo-saveto"></i><span>一键转存</span>`;
            button.style.backgroundColor = '#4CAF50';
            button.style.color = '#fff';
            button.style.borderColor = '#4CAF50';
            button.style.cursor = 'pointer';
            button.addEventListener('click', copyTo115);
            original2.parentNode.insertBefore(button, original2.nextSibling);
        }
        const original3 = document.querySelector('a[btn="confirm"].button.btn-large');
        if (original3 && !document.querySelector('#tm-copy-save-btn3')) {
            const button = document.createElement('a');
            button.id = 'tm-copy-save-btn3';
            button.className = 'button btn-large';
            button.innerHTML = '<span>一键转存</span>';
            button.style.backgroundColor = '#4CAF50';
            button.style.color = '#fff';
            button.style.borderColor = '#4CAF50';
            button.style.marginTop = '-15px';
            button.style.display = 'block';
            button.style.cursor = 'pointer';
            original3.parentNode.appendChild(document.createElement('br'));
            original3.parentNode.appendChild(button);
        }
    }
    
    // --- VIII. 启动流程 ---
    function init() {
        checkAndAutoCopy(); 
        injectGlobalStyles();
        addSettingsButton();
        
        const observer = new MutationObserver(addCustomButton);
        observer.observe(document.body, {childList: true, subtree: true});
        
        addCustomButton();
    }
    
    init();
})();
