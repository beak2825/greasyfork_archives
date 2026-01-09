// ==UserScript==
// @name         7mmtv一键下载
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Ctrl+右键点击视频链接自动搜索并推送资源到qBittorrent
// @author       Vithur
// @match        *://7mmtv.sx/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @connect      127.0.0.1
// @connect      cilisousuo.cc
// @connect      *
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/561925/7mmtv%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/561925/7mmtv%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置区 ====================
    const CONFIG = {
        qb: {
            host: 'http://127.0.0.1:8080',
            username: 'admin',
            password: 'adminadmin',
            savePath: '/Video/download/jav' 
        },
        search: {
            baseUrl: 'https://cilisousuo.cc',
            keyword: 'hhd800',
            timeout: 10000
        },
        videoSites: ['7mmtv.sx', 'javdb.com', 'javbus.com', 'javlibrary.com', 'missav.com']
    };

    let authCookie = '';

    // ==================== 工具函数 ====================

    // 提取番号
    function extractVideoCode(text, url) {
        if (!text && !url) return null;
        const combined = `${text || ''} ${url || ''}`;
        const patterns = [
            /([A-Z]{2,6}-\d{3,5})/i,
            /(\d{3,6}[A-Z]{2,6}-\d{3,5})/i,
            /([A-Z]{2,6}\d{3,5})/i
        ];
        for (const pattern of patterns) {
            const match = combined.match(pattern);
            if (match) return match[1].toUpperCase();
        }
        return null;
    }

    // 登录 qBittorrent
    function loginQB() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${CONFIG.qb.host}/api/v2/auth/login`,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: `username=${encodeURIComponent(CONFIG.qb.username)}&password=${encodeURIComponent(CONFIG.qb.password)}`,
                timeout: 5000,
                onload: (res) => {
                    if (res.status === 200 && res.responseText === 'Ok.') {
                        const cookies = res.responseHeaders.match(/set-cookie:\s*([^;]+)/i);
                        if (cookies) authCookie = cookies[1];
                        resolve();
                    } else {
                        reject('qBittorrent 登录失败');
                    }
                },
                onerror: () => reject('无法连接到 qBittorrent')
            });
        });
    }

    // 推送磁力链接
    function pushToQB(magnetLink) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${CONFIG.qb.host}/api/v2/torrents/add`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cookie': authCookie
                },
                data: `urls=${encodeURIComponent(magnetLink)}&savepath=${encodeURIComponent(CONFIG.qb.savePath)}`,
                timeout: 5000,
                onload: (res) => {
                    if (res.status === 200) {
                        resolve();
                    } else if (res.status === 403) {
                        reject('qBittorrent 认证失败');
                    } else {
                        reject(`推送失败: ${res.status}`);
                    }
                },
                onerror: () => reject('推送请求失败')
            });
        });
    }

    // 步骤1: 搜索并获取详情页链接
    function searchDetailPageUrl(videoCode) {
        return new Promise((resolve, reject) => {
            const searchUrl = `${CONFIG.search.baseUrl}/search?q=${encodeURIComponent(videoCode)}`;
            console.log(`[搜索] ${searchUrl}`);

            GM_xmlhttpRequest({
                method: 'GET',
                url: searchUrl,
                timeout: CONFIG.search.timeout,
                onload: (res) => {
                    if (res.status === 200) {
                        const detailUrl = parseDetailUrl(res.responseText, videoCode);
                        if (detailUrl) {
                            console.log(`[搜索] ✓ 找到详情页: ${detailUrl}`);
                            resolve(detailUrl);
                        } else {
                            reject(`未找到包含 ${CONFIG.search.keyword} 的 ${videoCode} 资源`);
                        }
                    } else {
                        reject(`搜索失败: ${res.status}`);
                    }
                },
                onerror: () => reject('搜索请求失败')
            });
        });
    }

    // 从搜索结果页解析详情页链接
    function parseDetailUrl(html, videoCode) {
        const keyword = CONFIG.search.keyword.toLowerCase();
        const code = videoCode.toUpperCase();

        console.log(`[解析] 查找包含 "${keyword}" 和 "${code}" 的结果`);

        // 方法1: 用正则提取所有 /magnet/xxx 格式的链接
        const magnetUrlPattern = /href=["']?(\/magnet\/[a-zA-Z0-9]+)["']?/gi;
        const matches = [...html.matchAll(magnetUrlPattern)];

        console.log(`[解析] 找到 ${matches.length} 个 /magnet/ 链接`);

        // 遍历每个链接，检查其周围上下文
        for (const match of matches) {
            const url = match[1];
            const matchIndex = match.index;

            // 提取链接周围 2000 字符的上下文
            const contextStart = Math.max(0, matchIndex - 1000);
            const contextEnd = Math.min(html.length, matchIndex + 1000);
            const context = html.slice(contextStart, contextEnd).toLowerCase();

            // 检查上下文是否包含关键词和番号
            if (context.includes(keyword) && context.includes(code.toLowerCase())) {
                const fullUrl = `${CONFIG.search.baseUrl}${url}`;
                console.log(`[解析] ✓ 匹配成功: ${fullUrl}`);
                return fullUrl;
            }
        }

        // 方法2: 使用 DOM 解析（备用）
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const allLinks = doc.querySelectorAll('a[href*="/magnet/"]');

        for (const link of allLinks) {
            const href = link.href;
            const card = link.closest('[class*="card"], [class*="item"], [class*="result"], div');
            const cardText = card ? card.textContent.toLowerCase() : '';

            if (cardText.includes(keyword) && cardText.includes(code.toLowerCase())) {
                console.log(`[解析] ✓ DOM 匹配成功: ${href}`);
                return href;
            }
        }

        console.log(`[解析] ✗ 未找到匹配的详情页链接`);
        return null;
    }

    // 步骤2: 从详情页提取磁力链接
    function fetchMagnetFromDetail(detailUrl) {
        return new Promise((resolve, reject) => {
            console.log(`[详情页] ${detailUrl}`);

            GM_xmlhttpRequest({
                method: 'GET',
                url: detailUrl,
                timeout: CONFIG.search.timeout,
                onload: (res) => {
                    if (res.status === 200) {
                        const magnetLink = extractMagnetLink(res.responseText);
                        if (magnetLink) {
                            console.log(`[详情页] ✓ 找到磁力链接`);
                            resolve(magnetLink);
                        } else {
                            reject('详情页中未找到磁力链接');
                        }
                    } else {
                        reject(`访问详情页失败: ${res.status}`);
                    }
                },
                onerror: () => reject('详情页请求失败')
            });
        });
    }

    // 从详情页提取磁力链接 (多种方法)
    function extractMagnetLink(html) {
        console.log('[提取] 开始提取磁力链接...');

        // 方法1: 正则从整个HTML提取（最可靠）
        const magnetRegex = /magnet:\?xt=urn:btih:[a-fA-F0-9]{40}[^\s"'<>]*/;
        const match = html.match(magnetRegex);
        if (match) {
            console.log('[提取] ✓ 方法1成功 (正则匹配)');
            return match[0];
        }

        // 方法2: DOM 解析
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // 查找 <a href="magnet:">
        const magnetLink = doc.querySelector('a[href^="magnet:"]');
        if (magnetLink) {
            console.log('[提取] ✓ 方法2成功 (链接标签)');
            return magnetLink.href;
        }

        // 查找 data-clipboard-text 或其他 data 属性
        const clipboardEl = doc.querySelector('[data-clipboard-text^="magnet:"]');
        if (clipboardEl) {
            console.log('[提取] ✓ 方法3成功 (剪贴板属性)');
            return clipboardEl.dataset.clipboardText;
        }

        // 查找 input/textarea 值
        const inputs = doc.querySelectorAll('input, textarea');
        for (const input of inputs) {
            const value = input.value || input.textContent || '';
            if (value.startsWith('magnet:')) {
                console.log('[提取] ✓ 方法4成功 (输入框)');
                return value;
            }
        }

        console.log('[提取] ✗ 所有方法都失败');
        console.log('[提取] HTML 长度:', html.length, '字符');
        console.log('[提取] 是否包含 "magnet:":', html.includes('magnet:'));
        return null;
    }

    // 显示加载提示
    function showToast(message) {
        const toast = document.createElement('div');
        toast.id = 'nas-toast';
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px;
            background: #1a1a1a; color: white;
            padding: 15px 25px; border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            border: 1px solid #333;
            z-index: 999999; font-size: 14px; font-weight: 500;
            display: flex; align-items: center; gap: 10px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        toast.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="white" stroke-width="2.5" fill="none" style="animation: spin 1s linear infinite;">
                <style>@keyframes spin { 100% { transform: rotate(360deg); } }</style>
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
            </svg>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);
        return toast;
    }

    function removeToast() {
        const toast = document.getElementById('nas-toast');
        if (toast) toast.remove();
    }

    function showNotification(title, text) {
        GM_notification({ title, text, timeout: 3000 });
    }

    // ==================== 主流程 ====================

    async function handlePush(videoCode) {
        const toast = showToast(`处理中: ${videoCode}`);

        try {
            // 步骤1: 搜索获取详情页URL
            toast.querySelector('span').textContent = `[1/4] 搜索资源...`;
            const detailUrl = await searchDetailPageUrl(videoCode);

            // 步骤2: 从详情页提取磁力链接
            toast.querySelector('span').textContent = `[2/4] 获取磁力链接...`;
            const magnetLink = await fetchMagnetFromDetail(detailUrl);

            // 步骤3: 登录 qBittorrent
            toast.querySelector('span').textContent = `[3/4] 连接 qBittorrent...`;
            await loginQB();

            // 步骤4: 推送下载任务
            toast.querySelector('span').textContent = `[4/4] 推送下载任务...`;
            await pushToQB(magnetLink);

            removeToast();
            showNotification('✅ 推送成功', `${videoCode} 已添加到下载队列`);

        } catch (error) {
            removeToast();
            showNotification('❌ 推送失败', error.toString());
            console.error('错误:', error);
        }
    }

    // ==================== 右键菜单 ====================

    function createContextMenu(e) {
        const currentDomain = window.location.hostname;
        const isVideoSite = CONFIG.videoSites.some(site => currentDomain.includes(site));
        if (!isVideoSite) return;

        let target = e.target;
        while (target && target !== document.body) {
            if (target.tagName === 'A') break;
            target = target.parentElement;
        }
        if (!target || target.tagName !== 'A') return;

        const videoCode = extractVideoCode(target.textContent, target.href);
        if (!videoCode) return;

        // 检测是否按住 Ctrl/Cmd 键
        if (!e.ctrlKey && !e.metaKey) return;

        e.preventDefault();
        e.stopPropagation();

        // 直接推送下载，不显示菜单
        handlePush(videoCode);
    }

    // ==================== 初始化 ====================

    document.addEventListener('contextmenu', createContextMenu, true);

    console.log('✅ NAS 推送脚本已加载 (改进版)');
    console.log('💡 使用方法: 按住 Ctrl + 右键点击视频链接');

})();
