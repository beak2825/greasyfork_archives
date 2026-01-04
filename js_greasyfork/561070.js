// ==UserScript==
// @name         全网密码明文显示助手 (Global Password Revealer)
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  全能密码管理工具：支持点击/悬停/常显模式、一键复制密码、黑名单管理、UI 极简化。
// @author       CHERWIN
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561070/%E5%85%A8%E7%BD%91%E5%AF%86%E7%A0%81%E6%98%8E%E6%96%87%E6%98%BE%E7%A4%BA%E5%8A%A9%E6%89%8B%20%28Global%20Password%20Revealer%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561070/%E5%85%A8%E7%BD%91%E5%AF%86%E7%A0%81%E6%98%8E%E6%96%87%E6%98%BE%E7%A4%BA%E5%8A%A9%E6%89%8B%20%28Global%20Password%20Revealer%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 图标素材 (SVG Base64) ---
    const ICONS = {
        copy: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
        eyeOpen: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
        eyeClose: `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
    };

    // --- 默认配置 ---
    const DEFAULT_CONFIG = {
        mode: 3,             // 0:手动, 1:常显, 2:悬停, 3:点击(延时), 4:点击(移开)
        clickTrigger: 'click', 
        autoHideTime: 3000,    
        showCopyBtn: true,     
        showEyeBtn: true,      
        showBorder: true,
        blacklist: []          
    };

    let config = Object.assign({}, DEFAULT_CONFIG, GM_getValue('pg_config', {}));
    const currentHost = window.location.hostname;

    // --- 黑名单检查 ---
    // 如果在黑名单中，注册启用菜单并退出
    if (config.blacklist.includes(currentHost)) {
        GM_registerMenuCommand("✅ 在此网站启用脚本", () => toggleBlacklist(false));
        return; 
    } else {
        GM_registerMenuCommand("🚫 在此网站禁用脚本", () => toggleBlacklist(true));
    }

    function toggleBlacklist(shouldDisable) {
        if (shouldDisable) {
            config.blacklist.push(currentHost);
            alert(`[CHERWIN] 已将 ${currentHost} 加入黑名单，脚本停止运行。`);
        } else {
            config.blacklist = config.blacklist.filter(h => h !== currentHost);
            alert(`[CHERWIN] 已将 ${currentHost} 移出黑名单，脚本恢复运行。`);
        }
        GM_setValue('pg_config', config);
        location.reload();
    }

    // --- 样式注入 ---
    const css = `
        .pg-wrapper { position: relative !important; display: inline-block; width: fit-content; }
        .pg-icon-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            z-index: 9999;
            padding: 4px;
            border-radius: 4px;
            line-height: 0;
            background: rgba(255,255,255,0.8);
            color: #555;
            transition: all 0.2s;
            display: flex; align-items: center; justify-content: center;
        }
        .pg-icon-btn:hover { background: #fff; color: #000; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
        .pg-copy-btn { right: 4px; }
        .pg-eye-btn { right: 28px; }
        .pg-revealed { 
            border: 2px solid #ff4444 !important; 
            background-color: #fff0f0 !important; 
            -webkit-text-security: none !important;
            text-security: none !important;
        }
        /* 设置面板样式 */
        #pg-settings-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 1000000; display: none;
            justify-content: center; align-items: center; font-family: system-ui, -apple-system, sans-serif;
        }
        #pg-settings-box {
            background: #fff; padding: 25px; border-radius: 12px; width: 420px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2); color: #333;
        }
        #pg-settings-box h2 { margin: 0 0 20px 0; font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 15px; }
        .pg-row { margin-bottom: 15px; display: flex; align-items: center; justify-content: space-between; }
        .pg-row label { font-size: 14px; font-weight: 500; }
        .pg-row select, .pg-row input[type="number"] { padding: 6px; border: 1px solid #ddd; border-radius: 4px; }
        .pg-actions { text-align: right; margin-top: 25px; }
        .pg-btn { padding: 8px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; }
        .pg-save { background: #2563eb; color: white; }
        .pg-close { background: #f3f4f6; color: #374151; margin-right: 10px; }
    `;
    
    const styleInject = setInterval(() => {
        if (document.head) {
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
            clearInterval(styleInject);
        }
    }, 50);

    // --- 核心逻辑 ---

    function reveal(input) {
        if (input.type === 'password' || input.style.webkitTextSecurity) {
            input.dataset.pgRealType = 'password';
            input.type = 'text';
            input.style.webkitTextSecurity = 'none';
            if(config.showBorder) input.classList.add('pg-revealed');
            updateEyeIcon(input, true);
        }
    }

    function hide(input) {
        if (input.dataset.pgRealType === 'password') {
            input.type = 'password';
            input.style.webkitTextSecurity = ''; 
            input.classList.remove('pg-revealed');
            updateEyeIcon(input, false);
        }
    }

    function toggle(input) {
        if (input.type === 'password') reveal(input);
        else hide(input);
    }

    function updateEyeIcon(input, isRevealed) {
        const wrapper = input.parentElement;
        if (!wrapper) return;
        const eyeBtn = wrapper.querySelector('.pg-eye-btn');
        if (eyeBtn) {
            eyeBtn.innerHTML = isRevealed ? ICONS.eyeOpen : ICONS.eyeClose;
            eyeBtn.title = isRevealed ? "点击隐藏密码" : "点击显示密码";
        }
    }

    function copyPassword(input) {
        const val = input.value;
        if (!val) return;
        navigator.clipboard.writeText(val).then(() => {
            const btn = input.parentElement.querySelector('.pg-copy-btn');
            if(btn) {
                btn.style.color = '#10b981'; 
                setTimeout(() => btn.style.color = '#555', 1000);
            }
        });
    }

    function processInput(input) {
        if (input.dataset.pgProcessed) return;
        input.dataset.pgProcessed = 'true';

        let parent = input.parentElement;
        const parentStyle = window.getComputedStyle(parent);
        if (parentStyle.position === 'static') {
            parent.style.position = 'relative';
        }

        // 注入小眼睛
        if (config.showEyeBtn) {
            const eye = document.createElement('div');
            eye.className = 'pg-icon-btn pg-eye-btn';
            eye.innerHTML = ICONS.eyeClose;
            eye.onclick = (e) => {
                e.preventDefault(); e.stopPropagation();
                toggle(input);
            };
            if (!config.showCopyBtn) eye.style.right = '4px'; 
            parent.insertBefore(eye, input.nextSibling);
        }

        // 注入复制按钮
        if (config.showCopyBtn) {
            const copy = document.createElement('div');
            copy.className = 'pg-icon-btn pg-copy-btn';
            copy.innerHTML = ICONS.copy;
            copy.title = "复制密码";
            copy.onclick = (e) => {
                e.preventDefault(); e.stopPropagation();
                copyPassword(input);
            };
            parent.insertBefore(copy, input.nextSibling);
        }

        // --- 自动化模式逻辑 ---
        if (config.mode === 1) { 
            reveal(input);
            input.addEventListener('input', () => reveal(input)); 
        } 
        else if (config.mode === 2) { 
            input.addEventListener('mouseenter', () => reveal(input));
            input.addEventListener('mouseleave', () => hide(input));
        } 
        else if (config.mode === 3) { 
            input.addEventListener(config.clickTrigger, () => {
                reveal(input);
                if (input.dataset.pgTimeout) clearTimeout(input.dataset.pgTimeout);
                input.dataset.pgTimeout = setTimeout(() => hide(input), config.autoHideTime);
            });
        } 
        else if (config.mode === 4) { 
            input.addEventListener(config.clickTrigger, () => reveal(input));
            input.addEventListener('mouseleave', () => hide(input));
        }
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    if (node.tagName === 'INPUT' && (node.type === 'password' || node.name?.toLowerCase().includes('pass'))) {
                        processInput(node);
                    } else if (node.querySelectorAll) {
                        node.querySelectorAll('input[type="password"]').forEach(processInput);
                    }
                }
            });
        });
    });
    observer.observe(document, { childList: true, subtree: true });
    window.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('input[type="password"]').forEach(processInput);
    });

    // --- 设置界面 ---
    GM_registerMenuCommand("⚙️ 密码助手设置", () => {
        let overlay = document.getElementById('pg-settings-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'pg-settings-overlay';
            overlay.innerHTML = `
                <div id="pg-settings-box">
                    <h2>全网密码明文显示助手 <span style="font-size:12px;color:#999;margin-left:5px">by CHERWIN</span></h2>
                    <div class="pg-row"><label>自动化模式</label><select id="pg-mode">
                        <option value="1">总是显示</option><option value="2">鼠标悬停显示</option>
                        <option value="3">点击显示 (自动消失)</option><option value="4">点击显示 (移开消失)</option>
                        <option value="0">手动模式 (仅靠小眼睛)</option>
                    </select></div>
                    <div class="pg-row"><label>点击触发</label><select id="pg-trigger"><option value="click">单击</option><option value="dblclick">双击</option></select></div>
                    <div class="pg-row"><label>自动消失时间(ms)</label><input type="number" id="pg-timer" style="width:60px"></div>
                    <div class="pg-row"><label>显示复制按钮</label><input type="checkbox" id="pg-copy-chk"></div>
                    <div class="pg-row"><label>显示小眼睛切换</label><input type="checkbox" id="pg-eye-chk"></div>
                    <div class="pg-row"><label>红框高亮明文</label><input type="checkbox" id="pg-border-chk"></div>
                    <div style="font-size:12px; color:#666; margin-top:10px;">* 黑名单管理请在脚本菜单中点击"在此网站禁用"</div>
                    <div class="pg-actions">
                        <button class="pg-btn pg-close" id="pg-close">取消</button>
                        <button class="pg-btn pg-save" id="pg-save">保存</button>
                    </div>
                </div>`;
            document.body.appendChild(overlay);
            
            document.getElementById('pg-close').onclick = () => overlay.style.display = 'none';
            document.getElementById('pg-save').onclick = () => {
                const newConf = {
                    mode: parseInt(document.getElementById('pg-mode').value),
                    clickTrigger: document.getElementById('pg-trigger').value,
                    autoHideTime: parseInt(document.getElementById('pg-timer').value),
                    showCopyBtn: document.getElementById('pg-copy-chk').checked,
                    showEyeBtn: document.getElementById('pg-eye-chk').checked,
                    showBorder: document.getElementById('pg-border-chk').checked,
                    blacklist: config.blacklist
                };
                GM_setValue('pg_config', newConf);
                location.reload();
            };
        }
        
        const el = (id) => document.getElementById(id);
        el('pg-mode').value = config.mode;
        el('pg-trigger').value = config.clickTrigger;
        el('pg-timer').value = config.autoHideTime;
        el('pg-copy-chk').checked = config.showCopyBtn;
        el('pg-eye-chk').checked = config.showEyeBtn;
        el('pg-border-chk').checked = config.showBorder;
        
        overlay.style.display = 'flex';
    });
})();
