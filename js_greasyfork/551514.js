// ==UserScript==
// @name         B站/油管&视频转Get笔记
// @namespace    http://tampermonkey.net/
// @version      2.2.0
// @description  一键将 Bilibili 或 YouTube 视频转换为Get笔记，并提供大强远程支持链接。
// @author       ChatGPT & Gemini
// @match        https://www.bilibili.com/video/*
// @match        https://www.youtube.com/watch*
// @match        https://www.biji.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551514/B%E7%AB%99%E6%B2%B9%E7%AE%A1%E8%A7%86%E9%A2%91%E8%BD%ACGet%E7%AC%94%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/551514/B%E7%AB%99%E6%B2%B9%E7%AE%A1%E8%A7%86%E9%A2%91%E8%BD%ACGet%E7%AC%94%E8%AE%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = { debug: true };

    const logger = {
        log: (msg, ...args) => CONFIG.debug && console.log(`[视频转Get笔记] ${msg}`, ...args),
        error: (msg, ...args) => console.error(`[视频转Get笔记] ${msg}`, ...args),
    };

    const PageType = {
        BILIBILI_VIDEO: 'bilibili_video',
        YOUTUBE_VIDEO: 'youtube_video',
        GET_NOTE: 'get_note',
        UNKNOWN: 'unknown'
    };

    function getCurrentPageType() {
        const host = window.location.hostname;
        const pathname = window.location.pathname;

        if (host === 'www.biji.com') return PageType.GET_NOTE;
        if (host === 'www.bilibili.com' && pathname.startsWith('/video/')) return PageType.BILIBILI_VIDEO;
        if (host === 'www.youtube.com' && pathname === '/watch') return PageType.YOUTUBE_VIDEO;
        return PageType.UNKNOWN;
    }

    function extractBilibiliVideoInfo() {
        const currentUrl = window.location.href.split('?')[0];
        let videoTitle = document.title.replace(/_哔哩哔哩 \(゜-゜\)つロ 干杯~-bilibili/, '').trim();
        const titleElement = document.querySelector('.video-title.van-ellipsis') || document.querySelector('.tit');
        if (titleElement?.textContent) videoTitle = titleElement.textContent.trim();
        return { url: currentUrl, title: videoTitle, platform: 'Bilibili' };
    }

    function extractYouTubeVideoInfo() {
        const currentUrl = window.location.href.split('&')[0];
        let videoTitle = document.title.replace(/ - YouTube$/, '').trim();
        const titleElement = document.querySelector('#title h1.ytd-watch-metadata');
        if (titleElement?.textContent) videoTitle = titleElement.textContent.trim();
        return { url: currentUrl, title: videoTitle, platform: 'YouTube' };
    }

    function createStyles() {
        const styles = `
            .gn-to-get-btn { position: fixed; z-index: 9999; background: rgba(0, 122, 255, 0.95); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); color: white; border: none; border-radius: 14px; padding: 12px 24px; font-size: 15px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; cursor: pointer; box-shadow: 0 4px 20px rgba(0, 122, 255, 0.25), 0 1px 3px rgba(0, 0, 0, 0.1); transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); border: 0.5px solid rgba(255, 255, 255, 0.1); letter-spacing: -0.02em; user-select: none; -webkit-user-select: none; }
            .gn-to-get-btn:hover { transform: translateY(-1px) scale(1.02); box-shadow: 0 6px 25px rgba(0, 122, 255, 0.35), 0 2px 8px rgba(0, 0, 0, 0.15); }
            .gn-to-get-btn:active { transform: translateY(0px) scale(0.98); box-shadow: 0 2px 10px rgba(0, 122, 255, 0.3); transition: all 0.1s ease; }
            .gn-to-get-btn:disabled { opacity: 0.8; cursor: not-allowed; transform: none; }
            /* B站按钮样式 */
            .gn-to-get-single-bili { top: 50%; right: 24px; transform: translateY(-50%); background: rgba(252, 98, 142, 0.95); box-shadow: 0 4px 20px rgba(252, 98, 142, 0.25); }
            .gn-to-get-single-bili:hover { background: rgba(252, 98, 142, 1); box-shadow: 0 6px 25px rgba(252, 98, 142, 0.35); }
            /* YouTube按钮样式 */
            .gn-to-get-single-youtube { top: 50%; right: 24px; transform: translateY(-50%); background: rgba(255, 0, 0, 0.95); box-shadow: 0 4px 20px rgba(255, 0, 0, 0.25); }
            .gn-to-get-single-youtube:hover { background: rgba(255, 0, 0, 1); box-shadow: 0 6px 25px rgba(255, 0, 0, 0.35); }

            /* --- 广告/支持按钮样式 (已修改为蓝色) --- */
            .gn-ad-btn {
                top: calc(50% + 65px); /* 动态计算位置，放在主按钮下方 */
                right: 24px;
                transform: translateY(-50%);
                background: rgba(0, 122, 255, 0.85); /* <-- 修改为蓝色 */
                backdrop-filter: blur(15px);
                -webkit-backdrop-filter: blur(15px);
                box-shadow: 0 2px 10px rgba(0, 122, 255, 0.2); /* <-- 修改为蓝色阴影 */
                font-size: 13px;
                padding: 8px 18px;
            }
            .gn-ad-btn:hover {
                background: rgba(0, 122, 255, 1); /* <-- 修改为更亮的蓝色 */
                box-shadow: 0 4px 15px rgba(0, 122, 255, 0.25); /* <-- 修改为更深的蓝色阴影 */
            }

            /* Get笔记状态提示 */
            #get-note-status { position: fixed; top: 24px; right: 24px; z-index: 10000; background: rgba(28, 28, 30, 0.95); backdrop-filter: blur(20px); color: white; padding: 12px 20px; border-radius: 16px; font-size: 15px; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); cursor: default; transition: all 0.3s ease; border: 0.5px solid rgba(255, 255, 255, 0.1); user-select: none; animation: slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
            @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // 视频页面的转换器 (通用)
    class VideoPageConverter {
        constructor(pageType) {
            this.pageType = pageType;
        }

        init() { this.createButtons(); }

        createButtons() {
            // --- 1. 创建主功能按钮 (转Get笔记) ---
            const mainButton = document.createElement('button');
            mainButton.textContent = '转Get笔记';
            const platformClass = this.pageType === PageType.YOUTUBE_VIDEO ? 'gn-to-get-single-youtube' : 'gn-to-get-single-bili';
            mainButton.className = `gn-to-get-btn ${platformClass}`;
            mainButton.addEventListener('click', () => {
                logger.log(`主按钮点击，平台: ${this.pageType}`);
                let videoInfo = (this.pageType === PageType.YOUTUBE_VIDEO) ? extractYouTubeVideoInfo() : extractBilibiliVideoInfo();
                if (!videoInfo.url) {
                    alert(`错误：无法获取当前 ${videoInfo.platform} 视频链接！`);
                    return;
                }
                GM_setValue('singleUrl', videoInfo.url);
                GM_setValue('singleTitle', videoInfo.title);
                GM_setValue('platform', videoInfo.platform);
                GM_setValue('conversionMode', 'single_new_tab');
                GM_setValue('initTime', Date.now().toString());
                GM_openInTab('https://www.biji.com', true);
                mainButton.textContent = '已发送 ✓';
                mainButton.disabled = true;
                setTimeout(() => {
                    mainButton.textContent = '转Get笔记';
                    mainButton.disabled = false;
                }, 2000);
            });
            document.body.appendChild(mainButton);

            // --- 2. 创建广告按钮 ---
            const adButton = document.createElement('button');
            adButton.textContent = '大强远程支持';
            adButton.className = 'gn-to-get-btn gn-ad-btn';
            adButton.addEventListener('click', () => {
                logger.log('广告按钮点击，跳转到 742112.xyz');
                GM_openInTab('https://742112.xyz', true);
            });
            document.body.appendChild(adButton);
        }
    }

    // Get笔记页面的自动处理程序 (这部分代码无需修改)
    class GetNoteAutoProcessor {
        async init() {
            const mode = GM_getValue('conversionMode');
            const initTime = GM_getValue('initTime');
            const isScriptTriggered = initTime && (Date.now() - parseInt(initTime)) < 60000;
            if (isScriptTriggered && mode === 'single_new_tab') {
                await this.handleSingleConversion();
            }
        }
        async handleSingleConversion() {
            const url = GM_getValue('singleUrl'), title = GM_getValue('singleTitle'), platform = GM_getValue('platform') || '视频';
            this.cleanupStorage(); this.createStatusIndicator();
            if (!url) { this.updateStatus('❌ 错误：未找到视频URL', '#dc3545'); return; }
            try {
                this.updateStatus('🚀 准备转换...', '#007bff');
                await this.waitForPageLoad();
                this.updateStatus('🔐 正在获取认证信息...', '#007bff');
                const authInfo = await this.extractAuthInfo();
                if (!authInfo.token && !authInfo.cookies) throw new Error('获取认证信息失败，请确保您已登录');
                this.updateStatus(`🔄 正在转换 ${platform} 视频...`, '#007bff');
                const result = await this.callApiWithAuth(url, title, platform, authInfo);
                if (result?.noteId) { this.updateStatus(`✅ 转换成功！3秒后刷新...`, '#28a745'); setTimeout(() => window.location.reload(), 3000); }
                else { throw new Error('API转换失败或未返回笔记ID'); }
            } catch (error) {
                logger.error('单条视频转换失败:', error);
                let userMessage = `❌ 转换失败: ${error.message}`;
                if (error.message.includes('超时')) userMessage += '。请检查网络或稍后再试。';
                else if (error.message.includes('认证失败')) userMessage += '。请刷新页面确保您已登录。';
                this.updateStatus(userMessage, '#dc3545');
            }
        }
        cleanupStorage() { GM_setValue('singleUrl', ''); GM_setValue('singleTitle', ''); GM_setValue('platform', ''); GM_setValue('conversionMode', ''); GM_setValue('initTime', ''); }
        async callApiWithAuth(url, title, platform, authInfo) {
            const requestData = { attachments: [{ size: 100, type: "link", title: title || `${platform}视频`, url: url }], content: "", entry_type: "ai", note_type: "link", source: "web", prompt_template_id: "" };
            const headers = { 'Content-Type': 'application/json', 'Accept': 'text/event-stream', 'Origin': 'https://www.biji.com', 'Referer': 'https://www.biji.com/', 'User-Agent': navigator.userAgent, 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' };
            if (authInfo.cookies) headers['Cookie'] = authInfo.cookies; if (authInfo.token) headers['Authorization'] = `Bearer ${authInfo.token}`;
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST', url: 'https://get-notes.luojilab.com/voicenotes/web/notes/stream', headers: headers, data: JSON.stringify(requestData), timeout: 60000,
                    onload: (response) => {
                        if (response.status === 200) { const lines = response.responseText.split('\n'); let noteId = null; for (const line of lines) { if (line.startsWith('data: ')) { try { const data = JSON.parse(line.substring(6)); if (data.data?.note_id) { noteId = data.data.note_id; break; } } catch (e) {} } } if (noteId) resolve({ noteId, url }); else reject(new Error('未从API响应中找到笔记ID')); }
                        else { let msg = `API请求失败: ${response.status}`; if (response.status === 403) msg += " (认证失败)"; reject(new Error(msg)); }
                    },
                    onerror: (err) => reject(new Error('网络请求失败，请检查代理或网络连接')),
                    ontimeout: () => reject(new Error('API 请求超时 (60秒)'))
                });
            });
        }
        async extractAuthInfo() { const authInfo = { cookies: document.cookie, token: null }; try { authInfo.token = localStorage.getItem('token') || localStorage.getItem('auth_token') || localStorage.getItem('access_token'); if (!authInfo.token) authInfo.token = sessionStorage.getItem('token') || sessionStorage.getItem('auth_token') || sessionStorage.getItem('access_token'); if (!authInfo.token) { const match = document.cookie.match(/(?:^|;)\s*(?:token|auth_token|jwt|access_token)=([^;]*)/); if (match) authInfo.token = match[1]; } } catch (error) { logger.error('提取认证信息失败:', error); } return authInfo; }
        createStatusIndicator() { if (document.getElementById('get-note-status')) return; const indicator = document.createElement('div'); indicator.id = 'get-note-status'; indicator.textContent = '🔄 脚本已激活'; document.body.appendChild(indicator); }
        updateStatus(message, color = '#28a745') { const indicator = document.getElementById('get-note-status'); if (indicator) { indicator.textContent = message; indicator.style.background = color; } }
        async waitForPageLoad() { if (document.readyState === 'complete') return; return new Promise(resolve => { window.addEventListener('load', resolve, { once: true }); setTimeout(resolve, 10000); }); }
    }

    // 页面管理器 (这部分代码无需修改)
    class PageManager {
        constructor() { this.currentUrl = location.href; this.urlCheckTimer = null; }
        init() {
            this.runForPage();
            const pageType = getCurrentPageType();
            if (pageType === PageType.BILIBILI_VIDEO || pageType === PageType.YOUTUBE_VIDEO) { this.startUrlMonitoring(); }
        }
        runForPage() {
            const pageType = getCurrentPageType();
            logger.log(`当前页面类型: ${pageType}`);
            switch (pageType) {
                case PageType.BILIBILI_VIDEO:
                case PageType.YOUTUBE_VIDEO:
                    document.querySelectorAll('.gn-to-get-btn').forEach(btn => btn.remove());
                    new VideoPageConverter(pageType).init();
                    break;
                case PageType.GET_NOTE:
                    new GetNoteAutoProcessor().init();
                    break;
            }
        }
        startUrlMonitoring() {
            this.urlCheckTimer = setInterval(() => {
                if (location.href !== this.currentUrl) {
                    this.currentUrl = location.href;
                    logger.log('URL发生变化，重新运行脚本逻辑:', this.currentUrl);
                    setTimeout(() => this.runForPage(), 500);
                }
            }, 1000);
        }
        destroy() { if (this.urlCheckTimer) clearInterval(this.urlCheckTimer); }
    }

    // 主程序初始化
    (async function() {
        createStyles();
        if (document.readyState === 'loading') await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
        const pageManager = new PageManager();
        pageManager.init();
        window.addEventListener('beforeunload', () => pageManager.destroy());
    })().catch(error => { logger.error('脚本初始化失败:', error); });

})();