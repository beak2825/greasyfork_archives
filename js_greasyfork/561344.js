// ==UserScript==
// @name         密码管理器 (坚果云同步)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  密码管理器，支持坚果云WebDAV同步、自动填充、备注功能
// @author       yoke0104x
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAD6klEQVR4AeybUXLbIBCGIedpegbnOblC2qMkOUqbKyTPbq/Q9DxR+Rjj0SCBELtIlivPrBGrZfffn4XKqLkxC36+vD4cbl/vj2f5ed/dIifd1x8Pz8iCkExzAs5Ju0Rt1x1NZw5nMafPSdfZ7gmBlKWIaEZASPyc9CnX0mYpIpoQQPK1iccEtSZCnQBK1ycfZyLsQwS+hW4Gw1UJACBAB1GUFPgmhpI770aNAIAB0Htt+EUMlphWCBUCAASwElC2sy+dtXcf395tX9Bxr8xHdyRmie2UjQoBN5/mYCY+JEfCf76/Pf99fPsVm6PjHjbYxvfjvjXdU6yr6YsJKCl9ZpfkSgFiO0mCe3bQqAIxAVNJkTyzO2UX34cExsb6fl+jCsQE5NY+s1iTfEiSsfgI/UGrUAUiAij/AaieglnsdasuvQ9rBnuGUfqICMhhyM5cbuDIvc7YlxG1V0mXgYiAXPn7mfMQG3+5ZSCJICJAEnjOWPYCo7QM4rhtCGgENgav0a8mQOPfYI0E8CHBUk0Aga9BdgKuYRYlOewVIGHvGsbuFXANsyjJobgC+OFzfqHhXmRkn8Hd42nfVuPav0tIZAqWEAOcSMJ0oJ4kgIcMXlT4536XmAcS2oG7niLYaLU914PLXgxwImAuISJLAA5aHHEPEmikgAhyyLlPEsDM4yA3eAv3yIFcUliTBJQcdKacXpqePSKFKUkAzKUGbU7PHpEAPUpArmQSfi5WHYClcholIAz6H9qdgNVm2Z0ace6veXhak8tqFfDx+H7HWR+Hp7wOqwGvMWYdAtzsD8CP6QZG+op1CNDPo9rjTkA1dRsbyH4zBnm0AlLGYw62rhslYOtJzcGfJmClXXkO+GLbTC5pAoq9X76h/bS/UyiTBOReSaecbVGfJOCaNkKeNlOTkyTAD8isHX9f8yvzm10SZuq3RpaAZsvAJds/q+tfS5Jl7FzJEuCXQaMq4MSJk1uE67nAS+1z5Y+PLAEYNKsCnDeWqfIn/CQBLasAAC1lavaJPUkARlusgpLZJ7ciAqiCUoc4XVvAWjL74CwiAEPvsNGGiH81cRg91kKHxQTgbwtLgaM2sJbKLAJYChxkljpf2o7SnxtzFgE4h4SaQIxtKWCaU/oBy2wCGEigS6oEsIAJbHOligCCUAn+ONttOvRXERcbDGCpjV9NQAjIpkP5hf5SLTGJLY0nJgAAlB8zASj6TcXNuqTkY2wqBASnEAEJSNCptafEmXVJycd4VAnAOSQgzJInwgFHXyVuLD7wpZ14wKNOQHDMLEEEwMPyIBn///5dYr4NxqHvWmx8wvxdoXt/iA98BdO4lfb/AQAA//9bNMFqAAAABklEQVQDABWhARl0b2IVAAAAAElFTkSuQmCC
// @license      MIT
// @connect      dav.jianguoyun.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/561344/%E5%AF%86%E7%A0%81%E7%AE%A1%E7%90%86%E5%99%A8%20%28%E5%9D%9A%E6%9E%9C%E4%BA%91%E5%90%8C%E6%AD%A5%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561344/%E5%AF%86%E7%A0%81%E7%AE%A1%E7%90%86%E5%99%A8%20%28%E5%9D%9A%E6%9E%9C%E4%BA%91%E5%90%8C%E6%AD%A5%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置 ====================
    const CONFIG_KEY = 'pm_config';
    const PASSWORDS_KEY = 'pm_passwords';
    const WEBDAV_FILE = '/dav/密码管理器/passwords.json';

    // ==================== 工具函数 ====================
    // 简单加密（生产环境建议使用更强的加密）
    function encrypt(text, key) {
        if (!key) return text;
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return btoa(result);
    }

    function decrypt(text, key) {
        if (!key) return text;
        try {
            const decoded = atob(text);
            let result = '';
            for (let i = 0; i < decoded.length; i++) {
                result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
            }
            return result;
        } catch {
            return text;
        }
    }

    // 获取配置
    function getConfig() {
        return GM_getValue(CONFIG_KEY, {
            webdavUrl: 'https://dav.jianguoyun.com',
            webdavUser: '',
            webdavPass: '',
            encryptKey: ''
        });
    }

    function setConfig(config) {
        GM_setValue(CONFIG_KEY, config);
    }

    // 获取密码列表
    function getPasswords() {
        return GM_getValue(PASSWORDS_KEY, []);
    }

    function setPasswords(passwords) {
        GM_setValue(PASSWORDS_KEY, passwords);
    }

    // 匹配当前网址的密码
    function matchPasswords(url) {
        const passwords = getPasswords();
        const hostname = new URL(url).hostname;
        return passwords.filter(p => {
            try {
                return new URL(p.url).hostname === hostname;
            } catch {
                return p.url.includes(hostname) || hostname.includes(p.url);
            }
        });
    }

    // ==================== WebDAV 操作 ====================
    function webdavRequest(method, path, data = null) {
        const config = getConfig();
        if (!config.webdavUser || !config.webdavPass) {
            return Promise.reject('请先配置坚果云账号');
        }

        const baseUrl = config.webdavUrl || 'https://dav.jianguoyun.com';

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: method,
                url: `${baseUrl}${path}`,
                headers: {
                    'Authorization': 'Basic ' + btoa(`${config.webdavUser}:${config.webdavPass}`),
                    'Content-Type': 'application/json'
                },
                data: data,
                onload: (res) => {
                    if (res.status >= 200 && res.status < 300) {
                        resolve(res.responseText);
                    } else if (res.status === 404) {
                        resolve(null);
                    } else {
                        reject(`WebDAV错误: ${res.status}`);
                    }
                },
                onerror: () => reject('网络错误')
            });
        });
    }

    // 确保目录存在
    async function ensureDir() {
        try {
            await webdavRequest('MKCOL', '/dav/密码管理器');
        } catch {}
    }

    // 上传到云端
    async function uploadToCloud(silent = false) {
        const config = getConfig();
        if (!config.webdavUser || !config.webdavPass) {
            if (!silent) showToast('请先在设置中配置坚果云账号', 'error');
            return;
        }
        
        const passwords = getPasswords();
        const data = JSON.stringify(passwords);
        const encrypted = encrypt(data, config.encryptKey);

        await ensureDir();
        await webdavRequest('PUT', WEBDAV_FILE, encrypted);
        if (!silent) showToast('同步上传成功');
    }

    // 从云端下载
    async function downloadFromCloud(silent = false) {
        const config = getConfig();
        if (!config.webdavUser || !config.webdavPass) {
            if (!silent) showToast('请先在设置中配置坚果云账号', 'error');
            return null;
        }
        
        const data = await webdavRequest('GET', WEBDAV_FILE);

        if (data) {
            const decrypted = decrypt(data, config.encryptKey);
            try {
                const passwords = JSON.parse(decrypted);
                setPasswords(passwords);
                if (!silent) showToast('同步下载成功');
                return passwords;
            } catch {
                if (!silent) showToast('解密失败，请检查加密密钥', 'error');
            }
        } else {
            if (!silent) showToast('云端暂无数据');
        }
        return null;
    }

    // ==================== UI 组件 ====================
    GM_addStyle(`
        * { box-sizing: border-box; }
        .pm-modal {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.6); z-index: 999999;
            display: flex; align-items: center; justify-content: center;
            backdrop-filter: blur(4px);
        }
        .pm-modal-content {
            background: linear-gradient(180deg, #fff 0%, #fafafa 100%);
            border-radius: 16px; padding: 0;
            width: 680px; max-width: 90vw; height: 600px; max-height: 85vh;
            box-shadow: 0 12px 48px rgba(0,0,0,0.25);
            position: relative; border: 1px solid rgba(255,255,255,0.8);
            display: flex; flex-direction: column; overflow: hidden;
        }
        .pm-modal-header {
            padding: 24px 28px 0; flex-shrink: 0;
        }
        .pm-modal-body {
            flex: 1; overflow-y: auto; padding: 0 28px;
        }
        .pm-modal-body::-webkit-scrollbar { width: 6px; }
        .pm-modal-body::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
        .pm-modal-body::-webkit-scrollbar-track { background: transparent; }
        .pm-modal-footer {
            padding: 16px 28px 24px; flex-shrink: 0;
            border-top: 1px solid #eee; background: #fafafa;
        }
        .pm-close-btn {
            position: absolute; top: 20px; right: 20px;
            border: none; background: #f0f0f0; font-size: 16px;
            cursor: pointer; color: #666; line-height: 1;
            width: 32px; height: 32px; border-radius: 50%;
            transition: all 0.2s; display: flex; align-items: center; justify-content: center;
            z-index: 10;
        }
        .pm-close-btn:hover { background: #e53935; color: #fff; transform: rotate(90deg); }
        .pm-modal-content label {
            display: block; margin-top: 16px; color: #444; font-size: 13px;
            font-weight: 600; letter-spacing: 0.3px;
        }
        .pm-modal-content label:first-of-type { margin-top: 0; }
        .pm-modal h3 {
            margin: 0 0 24px; color: #222; padding-right: 40px;
            font-size: 20px; font-weight: 600; letter-spacing: -0.3px;
        }
        .pm-input {
            width: 100%; padding: 12px 16px; margin: 8px 0 14px;
            border: 2px solid #e8e8e8; border-radius: 10px;
            font-size: 14px; transition: all 0.2s; background: #fff;
        }
        .pm-input:focus {
            outline: none; border-color: #4CAF50;
            box-shadow: 0 0 0 4px rgba(76,175,80,0.12);
        }
        .pm-input::placeholder { color: #bbb; }
        textarea.pm-input { resize: vertical; min-height: 80px; }
        .pm-btn {
            padding: 10px 20px; border: none; border-radius: 8px;
            cursor: pointer; margin-right: 10px; margin-top: 12px;
            font-size: 14px; font-weight: 600; transition: all 0.2s;
            display: inline-flex; align-items: center; gap: 6px;
        }
        .pm-btn-primary {
            background: linear-gradient(135deg, #4CAF50 0%, #43A047 100%);
            color: #fff; box-shadow: 0 4px 12px rgba(76,175,80,0.3);
        }
        .pm-btn-primary:hover {
            background: linear-gradient(135deg, #43A047 0%, #388E3C 100%);
            transform: translateY(-2px); box-shadow: 0 6px 16px rgba(76,175,80,0.4);
        }
        .pm-btn-danger {
            background: linear-gradient(135deg, #f44336 0%, #e53935 100%);
            color: #fff; box-shadow: 0 4px 12px rgba(244,67,54,0.3);
        }
        .pm-btn-danger:hover {
            background: linear-gradient(135deg, #e53935 0%, #d32f2f 100%);
            transform: translateY(-2px);
        }
        .pm-btn-secondary {
            background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
            color: #555; border: 1px solid #ddd;
        }
        .pm-btn-secondary:hover { background: linear-gradient(135deg, #e8e8e8 0%, #ddd 100%); }
        .pm-list { list-style: none; padding: 0; margin: 16px 0; }
        .pm-card-grid {
            display: grid; grid-template-columns: repeat(2, 1fr);
            gap: 12px; padding: 16px 0;
        }
        .pm-card {
            background: #fff; border: 1px solid #eee;
            border-radius: 12px; padding: 16px;
            transition: all 0.25s;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .pm-card:hover {
            border-color: #4CAF50;
            box-shadow: 0 4px 16px rgba(76,175,80,0.12);
            transform: translateY(-2px);
        }
        .pm-card-header { margin-bottom: 8px; }
        .pm-card-title { font-size: 15px; font-weight: 600; color: #333; margin-bottom: 4px; }
        .pm-card-user { font-size: 13px; color: #888; }
        .pm-card-actions {
            display: flex; gap: 8px; margin-top: 12px;
        }
        .pm-btn-sm { padding: 6px 12px; font-size: 12px; margin: 0; }
        .pm-list-item {
            padding: 16px 20px; background: #fff;
            border: 1px solid #eee; margin: 10px 0;
            border-radius: 12px; display: flex; justify-content: space-between;
            align-items: center; transition: all 0.25s;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .pm-list-item:hover {
            background: #fff; border-color: #4CAF50;
            box-shadow: 0 4px 16px rgba(76,175,80,0.12);
            transform: translateY(-2px);
        }
        .pm-list-item .pm-item-info { flex: 1; min-width: 0; }
        .pm-list-item .pm-item-title { color: #333; font-size: 15px; font-weight: 600; margin-bottom: 4px; }
        .pm-list-item .pm-item-user { color: #888; font-size: 13px; }
        .pm-list-item .pm-item-actions { display: flex; gap: 8px; flex-shrink: 0; margin-left: 16px; }
        .pm-list-item .pm-fill { opacity: 0; transition: opacity 0.2s; }
        .pm-list-item:hover .pm-fill { opacity: 1; }
        .pm-toast {
            position: fixed; top: 24px; right: 24px; padding: 16px 28px;
            background: linear-gradient(135deg, #333 0%, #1a1a1a 100%);
            color: #fff; border-radius: 12px; z-index: 9999999;
            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
            animation: pm-slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            font-weight: 500; font-size: 14px;
        }
        .pm-toast.error {
            background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
        }
        @keyframes pm-slideIn {
            from { transform: translateX(120%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .pm-tabs {
            display: flex; background: #f5f5f5; border-radius: 12px;
            padding: 6px; margin-bottom: 24px; gap: 6px;
        }
        .pm-tab {
            flex: 1; padding: 12px 20px; cursor: pointer;
            color: #666; font-size: 14px; font-weight: 600;
            transition: all 0.25s; border-radius: 8px; text-align: center;
        }
        .pm-tab:hover { color: #333; background: rgba(255,255,255,0.5); }
        .pm-tab.active {
            background: #fff; color: #4CAF50;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .pm-note {
            font-size: 12px; color: #4CAF50; margin-top: 6px;
            background: #e8f5e9; padding: 4px 8px; border-radius: 4px;
            display: inline-block;
        }
        .pm-dropdown {
            position: absolute; right: 0; top: 100%; background: #fff;
            border: 1px solid #e0e0e0; border-radius: 14px;
            box-shadow: 0 12px 36px rgba(0,0,0,0.18);
            z-index: 9999999; min-width: 320px; max-height: 400px;
            overflow: hidden;
        }
        .pm-dropdown-header {
            display: flex; background: #f8f8f8;
            border-radius: 14px 14px 0 0; padding: 8px;
            border-bottom: 1px solid #eee;
        }
        .pm-dropdown-tab {
            flex: 1; padding: 10px 12px; text-align: center; cursor: pointer;
            font-size: 12px; color: #888; border-radius: 8px;
            transition: all 0.2s; font-weight: 600;
        }
        .pm-dropdown-tab:hover { background: #fff; color: #555; }
        .pm-dropdown-tab.active {
            color: #fff; background: linear-gradient(135deg, #4CAF50, #43A047);
            box-shadow: 0 2px 8px rgba(76,175,80,0.3);
        }
        .pm-dropdown-list { max-height: 340px; overflow-y: auto; padding: 8px; }
        .pm-dropdown-list::-webkit-scrollbar { width: 4px; }
        .pm-dropdown-list::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }
        .pm-dropdown-item {
            padding: 14px 16px; border-radius: 10px; margin-bottom: 6px;
            transition: all 0.2s; background: #fafafa;
        }
        .pm-dropdown-item:last-child { margin-bottom: 0; }
        .pm-dropdown-item:hover { background: #f0f0f0; }
        .pm-dropdown-title { font-weight: 600; font-size: 14px; color: #333; }
        .pm-dropdown-sub { font-size: 12px; color: #999; margin-top: 4px; }
        .pm-dropdown-actions {
            display: flex; gap: 8px; margin-top: 10px;
        }
        .pm-dropdown-actions button {
            padding: 6px 12px; font-size: 11px; border: none;
            border-radius: 6px; background: #fff; cursor: pointer;
            transition: all 0.2s; font-weight: 600; color: #555;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .pm-dropdown-actions button:hover {
            background: #4CAF50; color: #fff;
            transform: translateY(-1px); box-shadow: 0 3px 8px rgba(76,175,80,0.3);
        }
        .pm-dropdown-empty {
            padding: 40px 20px; text-align: center; color: #bbb;
            font-size: 14px; font-weight: 500;
        }
        .pm-quick-btn {
            position: absolute;
            border: none; background: linear-gradient(135deg, #fff, #f8f8f8);
            cursor: pointer; font-size: 15px;
            z-index: 9999; padding: 4px 8px; border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.15);
            opacity: 0; transition: all 0.25s;
            height: 28px; line-height: 20px;
        }
        .pm-quick-btn:hover {
            background: linear-gradient(135deg, #4CAF50, #43A047);
            opacity: 1; transform: scale(1.1);
            box-shadow: 0 4px 14px rgba(76,175,80,0.4);
        }
        .pm-quick-btn.pm-visible { opacity: 1; }
        
        /* 设置页面样式 */
        .pm-modal-content small {
            display: block; color: #999; font-size: 12px;
            margin-top: -8px; margin-bottom: 12px;
        }
        
        /* 表单网格布局 */
        .pm-form-grid {
            display: grid; grid-template-columns: 1fr 1fr;
            gap: 16px;
        }
        .pm-form-group { margin-bottom: 0; }
        .pm-form-group label { margin-top: 0; }
        .pm-form-full { margin-top: 16px; }
        
        /* 确认弹窗 */
        .pm-confirm-box {
            background: #fff; border-radius: 16px; padding: 32px;
            text-align: center; box-shadow: 0 12px 48px rgba(0,0,0,0.25);
            min-width: 320px;
        }
        .pm-confirm-msg { font-size: 16px; color: #333; margin-bottom: 24px; font-weight: 500; }
        .pm-confirm-actions { display: flex; gap: 12px; justify-content: center; }
        .pm-confirm-actions .pm-btn { margin: 0; min-width: 100px; }
        
        /* 保存密码提示 */
        .pm-save-prompt {
            position: fixed; top: 20px; right: 20px; z-index: 9999999;
            animation: pm-slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pm-save-prompt-content {
            background: #fff; border-radius: 12px; padding: 16px 20px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            border-left: 4px solid #4CAF50; min-width: 280px;
        }
        .pm-save-prompt-text { font-size: 14px; color: #333; font-weight: 600; margin-bottom: 4px; }
        .pm-save-prompt-user { font-size: 13px; color: #666; margin-bottom: 12px; }
        .pm-save-prompt-actions { display: flex; gap: 8px; }
        .pm-save-prompt-actions .pm-btn { margin: 0; }
        .pm-save-input { padding: 8px 12px; margin-bottom: 8px; font-size: 13px; }
    `);

    function showToast(msg, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `pm-toast ${type}`;
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    function copyToClipboard(text, successMsg = '已复制') {
        navigator.clipboard.writeText(text).then(() => {
            showToast(successMsg);
        }).catch(() => {
            // fallback
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            textarea.remove();
            showToast(successMsg);
        });
    }

    function createModal(content) {
        const modal = document.createElement('div');
        modal.className = 'pm-modal';
        modal.innerHTML = `<div class="pm-modal-content"><button class="pm-close-btn">×</button>${content}</div>`;
        
        // 只能通过关闭按钮关闭
        modal.querySelector('.pm-close-btn').addEventListener('click', () => modal.remove());
        
        document.body.appendChild(modal);
        return modal;
    }

    // 自定义确认弹窗
    function showConfirm(message, onConfirm) {
        const modal = document.createElement('div');
        modal.className = 'pm-modal';
        modal.innerHTML = `
            <div class="pm-confirm-box">
                <div class="pm-confirm-msg">${message}</div>
                <div class="pm-confirm-actions">
                    <button class="pm-btn pm-btn-danger" id="pm-confirm-yes">确定删除</button>
                    <button class="pm-btn pm-btn-secondary" id="pm-confirm-no">取消</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.querySelector('#pm-confirm-yes').addEventListener('click', () => {
            modal.remove();
            onConfirm();
        });
        
        modal.querySelector('#pm-confirm-no').addEventListener('click', () => {
            modal.remove();
        });
    }


    // ==================== 主界面 ====================
    async function showMainPanel(skipSync = false) {
        // 先尝试从云端同步（可跳过）
        if (!skipSync) {
            const cfg = getConfig();
            if (cfg.webdavUser && cfg.webdavPass) {
                try {
                    await downloadFromCloud(true); // 静默模式
                } catch (e) {
                    console.log('[密码管理器] 云端同步失败:', e);
                }
            }
        }
        
        const passwords = getPasswords();
        const matched = matchPasswords(location.href);
        const config = getConfig();

        const modal = createModal(`
            <div class="pm-modal-header">
                <h3>🔐 密码管理器</h3>
                <div class="pm-tabs">
                    <div class="pm-tab active" data-tab="matched">当前网站 (${matched.length})</div>
                    <div class="pm-tab" data-tab="all">全部密码 (${passwords.length})</div>
                    <div class="pm-tab" data-tab="settings">设置</div>
                </div>
            </div>
            <div class="pm-modal-body" id="pm-tab-content"></div>
        `);

        const tabContent = modal.querySelector('#pm-tab-content');
        const tabs = modal.querySelectorAll('.pm-tab');

        function renderTab(tabName) {
            tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));

            if (tabName === 'matched') {
                renderPasswordList(tabContent, matched, true, modal);
            } else if (tabName === 'all') {
                renderPasswordList(tabContent, passwords, false, modal);
            } else if (tabName === 'settings') {
                renderSettings(tabContent, config, modal);
            }
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', () => renderTab(tab.dataset.tab));
        });

        renderTab('matched');
    }

    function renderPasswordList(container, list, showFill, modal) {
        // 移除已有的 footer
        const modalContent = modal.querySelector('.pm-modal-content');
        const existingFooter = modalContent.querySelector('.pm-modal-footer');
        if (existingFooter) existingFooter.remove();
        
        if (list.length === 0) {
            container.innerHTML = `
                <p style="color:#999; text-align:center; padding: 30px 0;">暂无密码记录</p>
            `;
        } else {
            container.innerHTML = `
                <div class="pm-card-grid">
                    ${list.map((p, i) => `
                        <div class="pm-card" data-index="${i}">
                            <div class="pm-card-header">
                                <div class="pm-card-title">${p.title || p.url}</div>
                                <div class="pm-card-user">${p.username}</div>
                            </div>
                            ${p.note ? `<div class="pm-note">📝 ${p.note}</div>` : ''}
                            <div class="pm-card-actions">
                                <button class="pm-btn pm-btn-primary pm-btn-sm pm-fill" data-idx="${i}">填充</button>
                                <button class="pm-btn pm-btn-secondary pm-btn-sm pm-edit" data-idx="${i}">编辑</button>
                                <button class="pm-btn pm-btn-danger pm-btn-sm pm-del" data-idx="${i}">删除</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        // 添加固定底部
        const footer = document.createElement('div');
        footer.className = 'pm-modal-footer';
        footer.innerHTML = `<button class="pm-btn pm-btn-primary" id="pm-add-new">+ 添加密码</button>`;
        modalContent.appendChild(footer);

        // 绑定事件
        footer.querySelector('#pm-add-new')?.addEventListener('click', () => showAddEdit());

        container.querySelectorAll('.pm-fill').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.idx);
                fillPassword(list[idx]);
            });
        });

        container.querySelectorAll('.pm-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.idx);
                const passwords = getPasswords();
                const realIdx = passwords.findIndex(p => p.id === list[idx].id);
                showAddEdit(passwords[realIdx], realIdx);
            });
        });

        container.querySelectorAll('.pm-del').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.idx);
                const item = list[idx];
                
                showConfirm(`确定删除「${item.title || item.username}」吗？`, async () => {
                    const passwords = getPasswords();
                    const realIdx = passwords.findIndex(p => p.id === item.id);
                    passwords.splice(realIdx, 1);
                    setPasswords(passwords);
                    showToast('已删除');
                    
                    // 自动同步到云端
                    const cfg = getConfig();
                    if (cfg.webdavUser && cfg.webdavPass) {
                        try {
                            await uploadToCloud(true);
                        } catch (e) {
                            console.log('[密码管理器] 自动同步失败:', e);
                        }
                    }
                    
                    // 直接刷新当前列表，不重新打开弹窗
                    const newList = showFill ? matchPasswords(location.href) : getPasswords();
                    renderPasswordList(container, newList, showFill, modal);
                    
                    // 更新标签页数字
                    const matched = matchPasswords(location.href);
                    const all = getPasswords();
                    const tabs = modal.querySelectorAll('.pm-tab');
                    tabs[0].textContent = `当前网站 (${matched.length})`;
                    tabs[1].textContent = `全部密码 (${all.length})`;
                });
            });
        });
    }

    function renderSettings(container, config, modal) {
        // 设置页面需要特殊处理，底部按钮要固定
        const modalContent = modal.querySelector('.pm-modal-content');
        
        // 移除已有的 footer
        const existingFooter = modalContent.querySelector('.pm-modal-footer');
        if (existingFooter) existingFooter.remove();
        
        container.innerHTML = `
            <div style="padding: 16px 0;">
                <label>WebDAV 地址</label>
                <input class="pm-input" id="pm-webdav-url" value="${config.webdavUrl || 'https://dav.jianguoyun.com'}" placeholder="https://dav.jianguoyun.com">

                <label>坚果云账号（邮箱）</label>
                <input class="pm-input" id="pm-webdav-user" value="${config.webdavUser || ''}" placeholder="your@email.com">

                <label>坚果云应用密码</label>
                <input class="pm-input" id="pm-webdav-pass" type="password" value="${config.webdavPass || ''}" placeholder="在坚果云设置中生成">
                <small>设置 → 安全选项 → 第三方应用管理 → 添加应用</small>

                <label>数据加密密钥（可选但推荐）</label>
                <input class="pm-input" id="pm-encrypt-key" type="password" value="${config.encryptKey || ''}" placeholder="用于加密云端数据">
            </div>
        `;
        
        // 添加固定底部
        const footer = document.createElement('div');
        footer.className = 'pm-modal-footer';
        footer.innerHTML = `
            <button class="pm-btn pm-btn-primary" id="pm-save-config">保存配置</button>
            <button class="pm-btn pm-btn-secondary" id="pm-upload">上传到云端</button>
            <button class="pm-btn pm-btn-secondary" id="pm-download">从云端下载</button>
        `;
        modalContent.appendChild(footer);

        footer.querySelector('#pm-save-config').addEventListener('click', () => {
            setConfig({
                webdavUrl: container.querySelector('#pm-webdav-url').value,
                webdavUser: container.querySelector('#pm-webdav-user').value,
                webdavPass: container.querySelector('#pm-webdav-pass').value,
                encryptKey: container.querySelector('#pm-encrypt-key').value
            });
            showToast('配置已保存');
        });

        footer.querySelector('#pm-upload').addEventListener('click', async () => {
            try {
                await uploadToCloud();
            } catch (e) {
                showToast(e, 'error');
            }
        });

        footer.querySelector('#pm-download').addEventListener('click', async () => {
            try {
                await downloadFromCloud();
                modal.remove();
                showMainPanel();
            } catch (e) {
                showToast(e, 'error');
            }
        });
    }

    // ==================== 添加/编辑密码 ====================
    function showAddEdit(item = null, index = -1) {
        document.querySelector('.pm-modal')?.remove();

        const isEdit = item !== null;
        const modal = createModal(`
            <div class="pm-modal-header">
                <h3>${isEdit ? '✏️ 编辑' : '➕ 添加'}密码</h3>
            </div>
            <div class="pm-modal-body">
                <div class="pm-form-grid">
                    <div class="pm-form-group">
                        <label>标题</label>
                        <input class="pm-input" id="pm-title" value="${item?.title || ''}" placeholder="例如：GitHub">
                    </div>
                    <div class="pm-form-group">
                        <label>网址</label>
                        <input class="pm-input" id="pm-url" value="${item?.url || location.origin}" placeholder="https://example.com">
                    </div>
                    <div class="pm-form-group">
                        <label>用户名</label>
                        <input class="pm-input" id="pm-username" value="${item?.username || ''}" placeholder="请输入用户名">
                    </div>
                    <div class="pm-form-group">
                        <label>密码</label>
                        <input class="pm-input" id="pm-password" type="password" value="${item?.password || ''}" placeholder="请输入密码">
                    </div>
                </div>
                <div class="pm-form-group pm-form-full">
                    <label>备注</label>
                    <textarea class="pm-input" id="pm-note" rows="2" placeholder="可选备注信息">${item?.note || ''}</textarea>
                </div>
            </div>
        `);
        
        // 添加底部按钮
        const modalContent = modal.querySelector('.pm-modal-content');
        const footer = document.createElement('div');
        footer.className = 'pm-modal-footer';
        footer.innerHTML = `
            <button class="pm-btn pm-btn-primary" id="pm-save">保存</button>
            <button class="pm-btn pm-btn-secondary" id="pm-cancel">取消</button>
        `;
        modalContent.appendChild(footer);

        footer.querySelector('#pm-save').addEventListener('click', async () => {
            const username = modal.querySelector('#pm-username').value.trim();
            const password = modal.querySelector('#pm-password').value;
            
            if (!username) {
                showToast('请输入用户名', 'error');
                modal.querySelector('#pm-username').focus();
                return;
            }
            if (!password) {
                showToast('请输入密码', 'error');
                modal.querySelector('#pm-password').focus();
                return;
            }
            
            const passwords = getPasswords();
            const newItem = {
                id: item?.id || Date.now().toString(),
                title: modal.querySelector('#pm-title').value,
                url: modal.querySelector('#pm-url').value,
                username: username,
                password: password,
                note: modal.querySelector('#pm-note').value,
                updatedAt: new Date().toISOString()
            };

            if (isEdit) {
                passwords[index] = newItem;
            } else {
                passwords.push(newItem);
            }

            setPasswords(passwords);
            showToast(isEdit ? '已更新' : '已添加');
            
            // 自动同步到云端
            const config = getConfig();
            if (config.webdavUser && config.webdavPass) {
                try {
                    await uploadToCloud(true); // 静默模式
                } catch (e) {
                    console.log('[密码管理器] 自动同步失败:', e);
                }
            }
            
            modal.remove();
            showMainPanel(true); // 跳过同步，因为刚刚已经同步过了
        });

        footer.querySelector('#pm-cancel').addEventListener('click', () => {
            modal.remove();
            showMainPanel(true); // 跳过同步
        });
    }

    // ==================== 自动填充 ====================
    function fillPassword(item, targetPasswordInput = null) {
        
        let passwordInput = targetPasswordInput;
        let usernameInput = null;

        // 如果没有指定目标密码框，找第一个
        if (!passwordInput) {
            const allPasswordInputs = document.querySelectorAll('input[type="password"]');
            for (const input of allPasswordInputs) {
                if (!input.closest('.pm-modal')) {
                    passwordInput = input;
                    break;
                }
            }
        }


        if (!passwordInput) {
            showToast('未找到密码框', 'error');
            return;
        }

        // 直接用 DOM 顺序找密码框前面的输入框
        const allInputs = Array.from(document.querySelectorAll('input'));
        const passwordIndex = allInputs.indexOf(passwordInput);
        
        for (let i = passwordIndex - 1; i >= 0; i--) {
            const input = allInputs[i];
            if (input.closest('.pm-modal')) continue;
            const type = (input.type || '').toLowerCase();
            if (type === 'text' || type === 'email' || type === 'tel') {
                usernameInput = input;
                break;
            }
        }


        let filled = false;

        if (usernameInput && item.username) {
            setInputValue(usernameInput, item.username);
            filled = true;
        }

        if (passwordInput && item.password) {
            setInputValue(passwordInput, item.password);
            filled = true;
        }

        if (filled) {
            showToast('已填充');
            document.querySelector('.pm-modal')?.remove();
        } else {
            showToast('填充失败', 'error');
        }
    }

    // 设置输入框值并触发事件
    function setInputValue(input, value) {
        // 先清空
        input.value = '';
        input.focus();
        
        // 使用 native setter 绕过框架拦截
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(input, value);
        
        // 触发各种事件
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.dispatchEvent(new InputEvent('input', { bubbles: true, data: value }));
    }

    // ==================== 快捷填充按钮（带下拉选择） ====================
    function addQuickFillButton() {
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        passwordInputs.forEach(input => {
            // 跳过已处理的和模态框内的输入框
            if (input.dataset.pmAdded) return;
            if (input.closest('.pm-modal')) return;
            input.dataset.pmAdded = 'true';

            // 创建按钮，不用 wrapper
            const btn = document.createElement('button');
            btn.className = 'pm-quick-btn';
            btn.textContent = '🔑';
            btn.title = '选择密码填充';
            btn.type = 'button';
            document.body.appendChild(btn);

            // 定位按钮到密码框右侧
            function positionBtn() {
                const rect = input.getBoundingClientRect();
                const btnHeight = 24;
                btn.style.top = (rect.top + window.scrollY + (rect.height - btnHeight) / 2) + 'px';
                btn.style.left = (rect.right + window.scrollX - 30) + 'px';
            }
            positionBtn();
            window.addEventListener('scroll', positionBtn);
            window.addEventListener('resize', positionBtn);

            // hover 显示
            input.addEventListener('mouseenter', () => btn.style.opacity = '1');
            input.addEventListener('mouseleave', () => {
                if (!dropdown) btn.style.opacity = '0';
            });
            btn.addEventListener('mouseenter', () => btn.style.opacity = '1');
            btn.addEventListener('mouseleave', () => {
                if (!dropdown) btn.style.opacity = '0';
            });

            let dropdown = null;

            function closeDropdown() {
                if (dropdown) {
                    dropdown.remove();
                    dropdown = null;
                    btn.classList.remove('pm-visible');
                    btn.style.opacity = '0';
                }
            }

            function renderDropdownList(container, list) {
                if (list.length === 0) {
                    container.innerHTML = '<div class="pm-dropdown-empty">暂无密码</div>';
                    return;
                }
                container.innerHTML = list.map((p, i) => `
                    <div class="pm-dropdown-item" data-idx="${i}">
                        <div class="pm-dropdown-title">${p.title || p.url}</div>
                        <div class="pm-dropdown-sub">${p.username}</div>
                        <div class="pm-dropdown-actions">
                            <button class="pm-copy-user" data-idx="${i}">复制账号</button>
                            <button class="pm-copy-pass" data-idx="${i}">复制密码</button>
                            <button class="pm-fill-btn" data-idx="${i}">填充</button>
                        </div>
                    </div>
                `).join('');

                container.querySelectorAll('.pm-copy-user').forEach(b => {
                    b.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const idx = parseInt(b.dataset.idx);
                        copyToClipboard(list[idx].username, '账号已复制');
                    });
                });

                container.querySelectorAll('.pm-copy-pass').forEach(b => {
                    b.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const idx = parseInt(b.dataset.idx);
                        copyToClipboard(list[idx].password, '密码已复制');
                    });
                });

                container.querySelectorAll('.pm-fill-btn').forEach(b => {
                    b.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const idx = parseInt(b.dataset.idx);
                        fillPassword(list[idx], input);
                        closeDropdown();
                    });
                });
            }

            async function showDropdown() {
                closeDropdown();
                
                // 先尝试从云端同步
                const cfg = getConfig();
                if (cfg.webdavUser && cfg.webdavPass) {
                    try {
                        await downloadFromCloud(true);
                    } catch (e) {
                        console.log('[密码管理器] 云端同步失败:', e);
                    }
                }
                
                const matched = matchPasswords(location.href);
                const all = getPasswords();

                dropdown = document.createElement('div');
                dropdown.className = 'pm-dropdown';
                dropdown.style.position = 'fixed';
                dropdown.innerHTML = `
                    <div class="pm-dropdown-header">
                        <div class="pm-dropdown-tab active" data-tab="matched">当前网站 (${matched.length})</div>
                        <div class="pm-dropdown-tab" data-tab="all">全部 (${all.length})</div>
                    </div>
                    <div class="pm-dropdown-list"></div>
                `;

                // 定位下拉框
                const rect = btn.getBoundingClientRect();
                dropdown.style.top = (rect.bottom + 5) + 'px';
                dropdown.style.right = (window.innerWidth - rect.right) + 'px';

                document.body.appendChild(dropdown);

                const listContainer = dropdown.querySelector('.pm-dropdown-list');
                const tabs = dropdown.querySelectorAll('.pm-dropdown-tab');

                function switchTab(tabName) {
                    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
                    renderDropdownList(listContainer, tabName === 'matched' ? matched : all);
                }

                tabs.forEach(tab => {
                    tab.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        switchTab(tab.dataset.tab);
                    });
                });

                switchTab('matched');

                setTimeout(() => {
                    document.addEventListener('click', function handler(e) {
                        if (!dropdown?.contains(e.target) && e.target !== btn) {
                            closeDropdown();
                            document.removeEventListener('click', handler);
                        }
                    });
                }, 10);
            }

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (dropdown) {
                    closeDropdown();
                } else {
                    showDropdown();
                    btn.classList.add('pm-visible');
                }
            });
        });
    }

    // ==================== 登录检测与保存提示 ====================
    let lastFilledCredentials = null;
    
    // 记录填充的凭据
    function recordCredentials(username, password) {
        lastFilledCredentials = {
            username,
            password,
            url: location.origin,
            time: Date.now()
        };
        console.log('[密码管理器] 记录凭据:', username);
    }
    
    // 显示保存密码提示
    function showSavePrompt() {
        if (!lastFilledCredentials) return;
        if (Date.now() - lastFilledCredentials.time > 300000) return; // 超过5分钟不提示
        
        // 移除已有的提示
        document.querySelector('.pm-save-prompt')?.remove();
        
        const { username, password, url } = lastFilledCredentials;
        
        // 检查是否已存在相同的密码
        const passwords = getPasswords();
        const exists = passwords.some(p => p.username === username && p.url === url);
        if (exists) {
            lastFilledCredentials = null;
            return;
        }
        
        const prompt = document.createElement('div');
        prompt.className = 'pm-save-prompt';
        prompt.innerHTML = `
            <div class="pm-save-prompt-content">
                <div class="pm-save-prompt-text">🔐 是否保存此密码？</div>
                <div class="pm-save-prompt-user">${username}</div>
                <input class="pm-input pm-save-input" id="pm-save-title" placeholder="名称（可选）" value="${document.title || ''}">
                <input class="pm-input pm-save-input" id="pm-save-note" placeholder="说明（可选）">
                <div class="pm-save-prompt-actions">
                    <button class="pm-btn pm-btn-primary pm-btn-sm" id="pm-save-yes">保存</button>
                    <button class="pm-btn pm-btn-secondary pm-btn-sm" id="pm-save-no">不保存</button>
                </div>
            </div>
        `;
        document.body.appendChild(prompt);
        
        prompt.querySelector('#pm-save-yes').addEventListener('click', async () => {
            const title = prompt.querySelector('#pm-save-title').value || document.title || url;
            const note = prompt.querySelector('#pm-save-note').value || '';
            
            const passwords = getPasswords();
            passwords.push({
                id: Date.now().toString(),
                title: title,
                url: url,
                username: username,
                password: password,
                note: note,
                updatedAt: new Date().toISOString()
            });
            setPasswords(passwords);
            showToast('密码已保存');
            
            // 自动同步
            const cfg = getConfig();
            if (cfg.webdavUser && cfg.webdavPass) {
                try { await uploadToCloud(true); } catch (e) {}
            }
            
            prompt.remove();
            lastFilledCredentials = null;
        });
        
        prompt.querySelector('#pm-save-no').addEventListener('click', () => {
            prompt.remove();
            lastFilledCredentials = null;
        });
        
        // 15秒后自动消失
        setTimeout(() => {
            prompt.remove();
        }, 15000);
    }
    
    // 监听登录行为
    function setupLoginDetection() {
        // 监听所有按钮和提交按钮的点击
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('button, input[type="submit"], [role="button"]');
            if (!btn) return;
            
            const btnText = (btn.textContent || btn.value || '').toLowerCase();
            if (!btnText.includes('登') && !btnText.includes('login') && !btnText.includes('sign')) return;
            
            // 查找页面上的密码框
            const passwordInput = document.querySelector('input[type="password"]:not([style*="display: none"])');
            if (!passwordInput || !passwordInput.value) return;
            
            // 找用户名输入框
            const allInputs = Array.from(document.querySelectorAll('input:not([type="hidden"]):not([type="password"]):not([type="submit"]):not([type="button"])'));
            const pwdIndex = Array.from(document.querySelectorAll('input')).indexOf(passwordInput);
            
            let usernameInput = null;
            for (let i = pwdIndex - 1; i >= 0; i--) {
                const input = document.querySelectorAll('input')[i];
                const type = (input.type || '').toLowerCase();
                if (type === 'text' || type === 'email' || type === 'tel' || type === '') {
                    if (input.value) {
                        usernameInput = input;
                        break;
                    }
                }
            }
            
            if (usernameInput && usernameInput.value && passwordInput.value) {
                recordCredentials(usernameInput.value, passwordInput.value);
                
                // 延迟显示保存提示（等待登录请求完成）
                setTimeout(() => {
                    showSavePrompt();
                }, 2000);
            }
        }, true);
        
        // 监听表单提交
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const passwordInput = form.querySelector('input[type="password"]');
            if (passwordInput && passwordInput.value) {
                const inputs = form.querySelectorAll('input');
                let usernameInput = null;
                for (const input of inputs) {
                    if (input === passwordInput) break;
                    const type = (input.type || '').toLowerCase();
                    if (type === 'text' || type === 'email' || type === 'tel') {
                        usernameInput = input;
                    }
                }
                if (usernameInput && usernameInput.value) {
                    recordCredentials(usernameInput.value, passwordInput.value);
                    setTimeout(showSavePrompt, 2000);
                }
            }
        }, true);
        
        // 监听回车键提交
        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Enter') return;
            
            const passwordInput = document.querySelector('input[type="password"]:not([style*="display: none"])');
            if (!passwordInput || !passwordInput.value) return;
            if (document.activeElement !== passwordInput && document.activeElement.type !== 'text' && document.activeElement.type !== 'email') return;
            
            const allInputs = Array.from(document.querySelectorAll('input'));
            const pwdIndex = allInputs.indexOf(passwordInput);
            
            let usernameInput = null;
            for (let i = pwdIndex - 1; i >= 0; i--) {
                const input = allInputs[i];
                const type = (input.type || '').toLowerCase();
                if ((type === 'text' || type === 'email' || type === 'tel') && input.value) {
                    usernameInput = input;
                    break;
                }
            }
            
            if (usernameInput && usernameInput.value && passwordInput.value) {
                recordCredentials(usernameInput.value, passwordInput.value);
                setTimeout(showSavePrompt, 2000);
            }
        }, true);
    }

    // ==================== 初始化 ====================
    GM_registerMenuCommand('打开密码管理器', showMainPanel);
    GM_registerMenuCommand('添加当前网站密码', () => showAddEdit());
    GM_registerMenuCommand('同步上传', uploadToCloud);
    GM_registerMenuCommand('同步下载', downloadFromCloud);

    // 延迟添加快捷按钮
    setTimeout(addQuickFillButton, 1000);

    // 监听DOM变化，处理动态加载的表单
    const observer = new MutationObserver(() => {
        setTimeout(addQuickFillButton, 500);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    
    // 启动登录检测
    setupLoginDetection();

})();
