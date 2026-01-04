// ==UserScript==
// @name         UnlockVip
// @namespace    https://example.com/
// @version      1.0.2
// @description  CSDN 文章页：创建下载任务并轮询至完成，内嵌预览或新标签打开预览/下载。
// @author       chatgpt
// @match        https://blog.csdn.net/*/article/details/*
// @match        https://*.blog.csdn.net/article/details/*
// @match        https://wenku.csdn.net/answer/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @connect      a.liaoyouliang.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551010/UnlockVip.user.js
// @updateURL https://update.greasyfork.org/scripts/551010/UnlockVip.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ========== 配置 ==========
    // 将 ENABLE_LOG 改为 true 可在右下角查看运行日志
    const ENABLE_LOG = false;

    // 可通过 localStorage 覆盖：
    //   localStorage.setItem('csdn_unlock_auth_key', '你的auth_key')
    const DEFAULTS = {
        authKey: '2a2b4f226e3e4a3c9a67',
        pollIntervalMs: 1500,
        pollTimeoutMs: 120000,
        prefer: 'preview' // 'preview' | 'download'
    };

    const API = {
        add: 'https://a.liaoyouliang.com/api/download/add',
        tasks: 'https://a.liaoyouliang.com/api/download/tasks',
        previewBase: 'https://a.liaoyouliang.com/api/preview/file/',
        downloadBase: 'https://a.liaoyouliang.com/api/download/file/'
    };

    // ========== 简易日志与面板 ==========
    let logPanel;
    let logList;
    let resultOverlay;
    let resultIframe;
    let resultOpenOrigin;
    const resultCache = new Map();

    const ensureLogPanel = () => {
        if (!ENABLE_LOG) return { logPanel: null, logList: null };
        if (logPanel && logList) return { logPanel, logList };

        logPanel = document.createElement('div');
        logPanel.id = 'csdn-unlockv2-log-panel';
        logPanel.style.cssText = `
            position: fixed !important;
            bottom: 16px !important;
            right: 16px !important;
            width: 380px !important;
            max-height: 60vh !important;
            display: flex !important;
            flex-direction: column !important;
            background: rgba(0,0,0,0.9) !important;
            color: #fff !important;
            font-size: 12px !important;
            border-radius: 8px !important;
            z-index: 2147483647 !important;
            overflow: hidden !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding: 6px 10px !important;
            background: rgba(255,255,255,0.08) !important;
            border-bottom: 1px solid rgba(255,255,255,0.12) !important;
        `;
        const title = document.createElement('span');
        title.textContent = 'CSDN 解锁日志';
        const clearBtn = document.createElement('button');
        clearBtn.textContent = '清空';
        clearBtn.style.cssText = `
            background: rgba(255,255,255,0.15) !important;
            border: none !important;
            color: #fff !important;
            font-size: 12px !important;
            padding: 2px 8px !important;
            border-radius: 4px !important;
            cursor: pointer !important;`;
        clearBtn.onclick = () => { if (logList) logList.textContent = ''; };
        header.appendChild(title);
        header.appendChild(clearBtn);

        logList = document.createElement('div');
        logList.style.cssText = 'padding: 8px 10px; overflow: auto;';

        logPanel.appendChild(header);
        logPanel.appendChild(logList);

        document.documentElement.appendChild(logPanel);
        return { logPanel, logList };
    };

    const appendToLogPanel = (args) => {
        if (!ENABLE_LOG) return;
        const { logList } = ensureLogPanel();
        if (!logList) return;
        const line = document.createElement('div');
        const ts = new Date().toLocaleTimeString('zh-CN', { hour12: false });
        try {
            const msg = args.map(x => typeof x === 'string' ? x : JSON.stringify(x)).join(' ');
            line.textContent = `${ts} ${msg}`;
        } catch {
            line.textContent = `${ts} ${args.join(' ')}`;
        }
        logList.appendChild(line);
        while (logList.childNodes.length > 200) logList.removeChild(logList.firstChild);
        logList.scrollTop = logList.scrollHeight;
    };

    const log = (...args) => {
        if (!ENABLE_LOG) return;
        try { console.log(...args); } catch {}
        try { if (typeof unsafeWindow !== 'undefined' && unsafeWindow?.console?.log) unsafeWindow.console.log(...args); } catch {}
        appendToLogPanel(args);
    };

    // ========== 结果内嵌展示 ==========
    const ensureResultOverlay = () => {
        if (resultOverlay && resultIframe && resultOpenOrigin) return { overlay: resultOverlay, iframe: resultIframe, openOrigin: resultOpenOrigin };

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed !important;
            inset: 0 !important;
            z-index: 2147483647 !important;
            background: rgba(0,0,0,0.75) !important;
            display: none !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 28px !important;`;

        const wrap = document.createElement('div');
        wrap.style.cssText = `
            width: min(1100px, 92vw) !important;
            height: min(90vh, 1000px) !important;
            background: #0a0a0a !important;
            border-radius: 12px !important;
            overflow: hidden !important;
            display: flex !important;
            flex-direction: column !important;`;

        const header = document.createElement('div');
        header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:10px 14px;color:#fff;background:rgba(255,255,255,0.08)';
        const title = document.createElement('span');
        title.textContent = '解锁结果已加载';
        const actions = document.createElement('div');
        actions.style.cssText = 'display:flex;gap:8px;align-items:center';
        const openOrigin = document.createElement('a');
        openOrigin.textContent = '新标签打开预览';
        openOrigin.href = '#';
        openOrigin.target = '_blank';
        openOrigin.rel = 'noopener noreferrer';
        openOrigin.style.cssText = 'color:#7bdcff;text-decoration:none;border:1px solid rgba(123,220,255,.4);padding:3px 8px;border-radius:6px';
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.style.cssText = 'color:#fff;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);padding:3px 8px;border-radius:6px;cursor:pointer';
        closeBtn.onclick = () => { overlay.style.display = 'none'; iframe.removeAttribute('srcdoc'); };
        actions.appendChild(openOrigin);
        actions.appendChild(closeBtn);
        header.appendChild(title);
        header.appendChild(actions);

        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'flex:1;border:none;background:#fff';
        iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-forms allow-modals allow-popups');

        wrap.appendChild(header);
        wrap.appendChild(iframe);
        overlay.appendChild(wrap);
        document.documentElement.appendChild(overlay);

        resultOverlay = overlay;
        resultIframe = iframe;
        resultOpenOrigin = openOrigin;
        return { overlay, iframe, openOrigin };
    };

    const withBaseHref = (html, sourceUrl) => {
        if (!sourceUrl) return html;
        try {
            const u = new URL(sourceUrl);
            const baseHref = `${u.protocol}//${u.host}${u.pathname.replace(/[^/]*$/, '')}`;
            const base = `<base href="${baseHref}">`;
            if (/<head[^>]*>/i.test(html)) return html.replace(/<head([^>]*)>/i, m => `${m}${base}`);
            if (/<html[^>]*>/i.test(html)) return html.replace(/<html([^>]*)>/i, m => `${m}<head>${base}</head>`);
            return `<head>${base}</head>${html}`;
        } catch { return html; }
    };

    // 直接通过 URL 在 overlay 内展示（跨域 iframe）
    const showUrlInOverlay = (url, linkText = '新标签打开预览') => {
        const { overlay, iframe, openOrigin } = ensureResultOverlay();
        openOrigin.textContent = linkText;
        openOrigin.href = url;
        openOrigin.target = '_blank';
        iframe.removeAttribute('srcdoc');
        iframe.src = url;
        overlay.style.display = 'flex';
    };

    // ========== 工具 ==========
    const gmRequest = typeof GM_xmlhttpRequest === 'function' ? GM_xmlhttpRequest
        : (typeof GM !== 'undefined' && typeof GM.xmlHttpRequest === 'function' ? GM.xmlHttpRequest : null);

    const buildTasksUrl = (authKey) => `${API.tasks}?auth_key=${encodeURIComponent(authKey)}`;

    const normalizeUrl = (url) => {
        try { const u = new URL(url); return `${u.protocol}//${u.host}${u.pathname}`; } catch { return url.split('?')[0].split('#')[0]; }
    };

    const gmFetchJson = async (url, options = {}) => {
        if (!gmRequest) {
            const resp = await fetch(url, options);
            if (!resp.ok) throw new Error(`请求失败 ${resp.status}`);
            return await resp.json();
        }
        return await new Promise((resolve, reject) => {
            try {
                gmRequest({
                    method: options.method || 'GET',
                    url,
                    data: options.body,
                    headers: options.headers || { 'Accept': 'application/json, text/plain, */*' },
                    onload: (res) => {
                        try { resolve(JSON.parse(res.responseText || '{}')); }
                        catch { reject(new Error('解析 JSON 失败')); }
                    },
                    onerror: () => reject(new Error('GM 请求失败')),
                    ontimeout: () => reject(new Error('GM 请求超时')),
                });
            } catch (e) { reject(e); }
        });
    };

    async function addTask(articleUrl, authKey) {
        const payload = { to_download_url: articleUrl, auth_key: authKey };
        log('添加任务:', payload);
        const json = await gmFetchJson(API.add, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!json) throw new Error('接口无响应');
        const taskId = json?.data?.task_id;
        if (!taskId) throw new Error(json?.message || '未返回 task_id');
        return taskId;
    }

    async function fetchTasks(authKey) {
        const url = buildTasksUrl(authKey);
        log('查询任务列表:', url);
        const json = await gmFetchJson(url, { method: 'GET', headers: { 'Accept': 'application/json' } });
        if (!json) throw new Error('接口无响应');
        return json?.data || [];
    }

    const delay = (ms) => new Promise(r => setTimeout(r, ms));

    async function waitForTaskDone(taskId, authKey, onProgress) {
        const start = Date.now();
        const { pollIntervalMs, pollTimeoutMs } = DEFAULTS;
        while (Date.now() - start < pollTimeoutMs) {
            const list = await fetchTasks(authKey);
            const item = Array.isArray(list) ? list.find(x => x?.id === taskId) : null;
            if (item) {
                onProgress?.(item);
                // 2 = 下载成功
                if (Number(item.status) === 2) return item;
                // 3/4 可能为失败或其他状态（未知），这里简单处理为错误
                if (Number(item.status) > 2) throw new Error(item.msg || '任务失败');
            }
            await delay(pollIntervalMs);
        }
        throw new Error('轮询超时，稍后再试');
    }

    // ========== 页面集成 ==========
    function setupCSDNPage() {
        const articleUrl = normalizeUrl(window.location.href);

        // 检测多种 VIP 元素
        const vipLink = document.querySelector('a.article-vip-box[href="https://mall.csdn.net/vip"]');
        const vipInfoWrap = document.querySelector('#vip-info-wrap.vip-info-wrap');
        const vipInfoText = document.querySelector('.info-header-text');

        // 如果没有找到任何 VIP 相关元素，跳过
        if (!vipLink && !vipInfoWrap && !vipInfoText) {
            log('未发现 VIP 元素，跳过渲染');
            return;
        }

        const btn = document.createElement('button');
        btn.textContent = '点击解析';
        btn.style.cssText = 'padding:4px 10px;font-size:14px;background:#4CAF50;color:#fff;border:none;border-radius:4px;cursor:pointer;flex-shrink:0;margin-left:8px';

        let busy = false;
        btn.onclick = async () => {
            if (busy) return;
            busy = true;
            const oldText = btn.textContent;
            btn.textContent = '解析中...';
            btn.disabled = true;
            try {
                const authKey = localStorage.getItem('csdn_unlock_auth_key') || DEFAULTS.authKey;
                // 1) 添加任务
                const taskId = await addTask(articleUrl, authKey);
                btn.textContent = '任务已创建，等待中...';
                // 2) 轮询任务状态
                const task = await waitForTaskDone(taskId, authKey, (item) => {
                    btn.textContent = `${item.msg || '处理中'}...`;
                });
                log('任务完成: ', task);
                // 3) 展示预览/下载
                const previewUrl = API.previewBase + taskId;
                const downloadUrl = API.downloadBase + taskId + '?attachment=False';
                const prefer = DEFAULTS.prefer;
                if (prefer === 'download') {
                    showUrlInOverlay(downloadUrl, '新标签打开下载');
                } else {
                    showUrlInOverlay(previewUrl, '新标签打开预览');
                }
                btn.textContent = '已展示内容';
            } catch (e) {
                console.error('解锁失败:', e);
                alert(`解锁失败：${e.message || e}`);
                btn.textContent = oldText;
                btn.disabled = false;
                busy = false;
                return;
            }

            setTimeout(() => {
                btn.textContent = oldText;
                btn.disabled = false;
                busy = false;
            }, 1500);
        };

        // 根据不同的 VIP 元素类型，选择合适的位置插入按钮
        let inserted = false;

        // 如果是文库页面，插入到标题下方的 data div 中
        if (vipInfoWrap || vipInfoText) {
            // 查找标题容器（class="title forbid"）的父容器
            const titleContainer = document.querySelector('.title.forbid');
            if (titleContainer && titleContainer.parentElement) {
                // 查找紧跟在标题后面的 data div
                const dataDiv = titleContainer.parentElement.querySelector('.data');
                if (dataDiv) {
                    // 调整按钮样式以适配文库页面
                    btn.style.cssText = 'padding:4px 12px;font-size:13px;background:#4CAF50;color:#fff;border:none;border-radius:4px;cursor:pointer;margin-left:16px;display:inline-block;vertical-align:middle';
                    // 插入到 data div 的最后面（浏览数据之后）
                    dataDiv.appendChild(btn);
                    inserted = true;
                }
            }

            // 如果上面的方法没有成功，尝试插入到 VIP 提示框附近
            if (!inserted) {
                const target = vipInfoWrap || vipInfoText;
                if (target && target.parentElement) {
                    btn.style.cssText = 'padding:8px 20px;font-size:14px;background:#4CAF50;color:#fff;border:none;border-radius:6px;cursor:pointer;margin:10px 0;display:block;font-weight:500';
                    target.parentElement.insertBefore(btn, target.nextSibling);
                    inserted = true;
                }
            }
        }

        // 如果是博客页面，插入到文章顶部栏
        if (!inserted) {
            const barContent = document.querySelector('.article-bar-top .bar-content') || document.querySelector('.article-bar-top');
            if (barContent) {
                barContent.appendChild(btn);
                inserted = true;
            }
        }

        // 兜底：插入到 body
        if (!inserted) {
            document.body.appendChild(btn);
        }
    }

    const host = window.location.hostname;
    if (/blog\.csdn\.net$/.test(host) || /\.blog\.csdn\.net$/.test(host) || /wenku\.csdn\.net$/.test(host)) {
        const init = () => setupCSDNPage();
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
    }
})();
