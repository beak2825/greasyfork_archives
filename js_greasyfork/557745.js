// ==UserScript==
// @name         Douyu-giver 礼物赠送 Cookie 同步助手 (高级版)
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  自动/手动同步 Cookie 到 GitHub 文件。每天自动检查一次。UI 更轻量。
// @author       DouyuHelperUser
// @match        https://www.douyu.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_cookie
// @grant        GM_notification
// @connect      api.github.com
// @downloadURL https://update.greasyfork.org/scripts/557745/Douyu-giver%20%E7%A4%BC%E7%89%A9%E8%B5%A0%E9%80%81%20Cookie%20%E5%90%8C%E6%AD%A5%E5%8A%A9%E6%89%8B%20%28%E9%AB%98%E7%BA%A7%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557745/Douyu-giver%20%E7%A4%BC%E7%89%A9%E8%B5%A0%E9%80%81%20Cookie%20%E5%90%8C%E6%AD%A5%E5%8A%A9%E6%89%8B%20%28%E9%AB%98%E7%BA%A7%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const COOKIE_FILE_PATH = '.github/douyu_cookie.txt';
    const AUTO_SYNC_INTERVAL_HOURS = 24; // 每 24 小时自动同步一次

    function utf8_to_b64(str) {
        return window.btoa(unescape(encodeURIComponent(str)));
    }

    // 轻量级提示 (右下角小卡片)
    function showToast(message, type = 'info', duration = 3000) {
        const old = document.getElementById('dy-helper-toast');
        if (old) old.remove();

        const toast = document.createElement('div');
        toast.id = 'dy-helper-toast';
        let bg = '#333';
        let icon = 'ℹ️';
        
        if (type === 'success') { bg = '#4caf50'; icon = '✅'; }
        if (type === 'error') { bg = '#f44336'; icon = '❌'; }

        toast.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; z-index: 10000;
            background: ${bg}; color: white; padding: 12px 20px;
            border-radius: 8px; font-family: sans-serif; font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center;
            transition: opacity 0.3s, transform 0.3s; opacity: 0; transform: translateY(20px);
        `;
        toast.innerHTML = `<span style="margin-right: 8px; font-size: 18px;">${icon}</span> ${message}`;
        
        document.body.appendChild(toast);
        
        // 动画入场
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });

        if (duration > 0) {
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(20px)';
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }
    }

    function getAllCookies() {
        return new Promise((resolve) => {
            if (typeof GM_cookie !== 'undefined') {
                GM_cookie.list({ url: 'https://www.douyu.com/' }, (cookies, error) => {
                    if (!error && cookies) {
                        resolve(cookies.map(c => `${c.name}=${c.value}`).join('; '));
                    } else {
                        resolve(document.cookie);
                    }
                });
            } else {
                resolve(document.cookie);
            }
        });
    }

    function getFileSha(token, repo, path) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.github.com/repos/${repo}/contents/${path}`,
                headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' },
                onload: r => {
                    if (r.status === 200) resolve(JSON.parse(r.responseText).sha);
                    else resolve(null);
                },
                onerror: () => resolve(null)
            });
        });
    }

    function putFile(token, repo, path, content, sha) {
        return new Promise((resolve, reject) => {
            const body = {
                message: 'chore: auto update cookie [skip ci]',
                content: content,
                sha: sha
            };
            GM_xmlhttpRequest({
                method: 'PUT',
                url: `https://api.github.com/repos/${repo}/contents/${path}`,
                headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' },
                data: JSON.stringify(body),
                onload: r => (r.status === 201 || r.status === 200) ? resolve() : reject(new Error(`code ${r.status}`)),
                onerror: () => reject(new Error('network error'))
            });
        });
    }

    async function runSync(manualCookie = null, isAuto = false) {
        const token = GM_getValue('gh_token');
        const repo = GM_getValue('gh_repo');
        
        // 如果是自动运行且没配置，直接静默退出
        if ((!token || !repo) && isAuto) return;
        if (!token || !repo) { setupConfig(); return; }

        // 自动运行频率检查
        if (isAuto) {
            const lastSync = GM_getValue('last_sync_time', 0);
            const hoursSince = (Date.now() - lastSync) / (1000 * 3600);
            if (hoursSince < AUTO_SYNC_INTERVAL_HOURS) {
                console.log(`[DouyuHelper] Skip auto sync. Last sync: ${hoursSince.toFixed(1)}h ago.`);
                return;
            }
        }

        if (!isAuto) showToast('正在同步...', 'info', 0);

        try {
            let finalCookie = manualCookie;
            if (!finalCookie) finalCookie = await getAllCookies();

            if (!finalCookie.includes('acf_uid') && !finalCookie.includes('acf_auth')) {
                 throw new Error('未检测到登录');
            }
            
            const content = utf8_to_b64(finalCookie);
            const sha = await getFileSha(token, repo, COOKIE_FILE_PATH);
            await putFile(token, repo, COOKIE_FILE_PATH, content, sha);

            // 记录成功时间
            GM_setValue('last_sync_time', Date.now());

            showToast('Cookie 已同步到 GitHub', 'success', 3000);
        } catch (e) {
            console.error(e);
            // 自动运行失败不弹窗打扰，除非是严重错误
            if (!isAuto) showToast(`同步失败: ${e.message}`, 'error', 5000);
        }
    }

    function setupConfig() {
        const t = prompt('GitHub Token:', GM_getValue('gh_token', ''));
        if (!t) return;
        const r = prompt('仓库路径 (例如 david/douyu_helper):', GM_getValue('gh_repo', ''));
        if (!r) return;
        GM_setValue('gh_token', t);
        GM_setValue('gh_repo', r);
        runSync(null, false); // 手动触发一次
    }

    function manualPaste() {
        const c = prompt('请粘贴 Cookie:');
        if (c && c.trim()) runSync(c.trim(), false);
    }

    GM_registerMenuCommand("🚀 立即同步", () => runSync(null, false));
    GM_registerMenuCommand("📋 手动粘贴 Cookie", manualPaste);
    GM_registerMenuCommand("⚙️ 设置", setupConfig);
    
    // 启动后延迟 5s 检查是否需要自动同步
    setTimeout(() => runSync(null, true), 5000);

})();
