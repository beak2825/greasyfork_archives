// ==UserScript==
// @name         dmhy123
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在动漫花园及其镜像站的详情页添加“转存123云盘”按钮，一键将磁力链接提交至123云盘离线下载，支持自动获取Token。
// @author       Nagisa
// @match        *://share.dmhy.org/*
// @match        *://dmhy.myheartsite.com/*
// @match        *://*.myheartsite.com/*
// @match        *://*.dmhy.org/*
// @match        *://*.123pan.com/*
// @connect      www.123pan.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=123pan.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_notification
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561601/dmhy123.user.js
// @updateURL https://update.greasyfork.org/scripts/561601/dmhy123.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const HOST = window.location.hostname;
    const PATH = window.location.pathname;
    const SEARCH = window.location.search;

    const IS_123 = HOST.includes('123pan.com');
    // 判定是否为文件管理页面 (首页或带路径参数的页面)
    const IS_123_HOME = IS_123 && (PATH === '/' && (!SEARCH || SEARCH.includes('homeFilePath')));

    const IS_MIRROR = HOST.includes('myheartsite.com') || !!document.querySelector('#app');

    // ================== CSS 样式 ==================
    const style = document.createElement('style');

    // 动漫花园按钮样式 (区分镜像与主站)
    let btnCss = '';
    if (IS_MIRROR) {
        btnCss = `
        .btn-123-save {
            display: inline-block; font-weight: 400; text-align: center; vertical-align: middle; user-select: none;
            border: 1px solid transparent; padding: .375rem .75rem; font-size: 1rem; line-height: 1.5; border-radius: .25rem;
            margin-left: 8px; color: #fff !important; background-color: #fd79a8;
            background-image: linear-gradient(315deg, #fd79a8 0%, #e66767 74%);
            cursor: pointer; transition: all .15s ease-in-out; box-shadow: 0 2px 5px rgba(253, 121, 168, 0.3);
        }
        .btn-123-save:hover { color: #fff; transform: translateY(-1px); box-shadow: 0 4px 8px rgba(253, 121, 168, 0.4); text-decoration: none; }
        .btn-123-save:active { transform: translateY(0); }`;
    } else {
        btnCss = `
        .btn-123-save {
            background-image: linear-gradient(315deg, #fd79a8 0%, #e66767 74%); color: white !important;
            border: none !important; margin-left: 10px; display: inline-flex; align-items: center; justify-content: center;
            border-radius: 4px; padding: 2px 10px; font-size: 12px; font-weight: bold; cursor: pointer;
            line-height: 1.5; text-decoration: none !important; vertical-align: middle;
            box-shadow: 0 2px 4px rgba(0,0,0,0.15); transition: all 0.2s;
        }
        .btn-123-save:hover { transform: translateY(-1px); box-shadow: 0 3px 6px rgba(0,0,0,0.25); filter: brightness(1.1); }`;
    }

    style.innerHTML = `
        ${btnCss}
        .btn-123-save:disabled { background: #95a5a6 !important; background-image: none !important; cursor: not-allowed; opacity: 0.7; transform: none !important; box-shadow: none !important; }
        .btn-123-icon { margin-right: 4px; }

        /* --- 123云盘悬浮组件容器 --- */
        #one23-float-container {
            position: fixed; bottom: 80px; right: 40px; z-index: 999999;
            display: flex; flex-direction: column; align-items: center; gap: 8px;
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        #one23-float-container.hiding { opacity: 0; transform: translateY(20px); pointer-events: none; }

        /* 主按钮 */
        #btn-123-token-update {
            width: 56px; height: 56px; background: rgba(52, 152, 219, 0.85); backdrop-filter: blur(5px);
            color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center;
            cursor: pointer; box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            border: 1px solid rgba(255, 255, 255, 0.18); transition: all 0.3s;
        }
        #btn-123-token-update:hover { transform: scale(1.1); background: rgba(41, 128, 185, 0.95); }
        #btn-123-token-update.success { background: #2ecc71 !important; transform: scale(1); cursor: default; }

        /* 关闭小按钮 */
        #btn-123-close {
            width: 24px; height: 24px; background: rgba(0,0,0,0.3); color: white;
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
            cursor: pointer; font-size: 14px; line-height: 1; transition: all 0.2s;
            opacity: 0.6;
        }
        #btn-123-close:hover { background: rgba(231, 76, 60, 0.8); opacity: 1; transform: scale(1.1); }

        .fab-icon svg { width: 28px; height: 28px; fill: white; }

        /* Toast */
        #one23-toast {
            position: fixed; top: 15%; left: 50%; transform: translateX(-50%) scale(0.9);
            padding: 12px 24px; background: rgba(33, 37, 41, 0.9); backdrop-filter: blur(4px);
            color: #fff; border-radius: 50px; z-index: 2147483647; font-size: 14px; font-weight: 500;
            opacity: 0; visibility: hidden; transition: all 0.3s; pointer-events: none;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 8px;
        }
        #one23-toast.show { opacity: 1; visibility: visible; transform: translateX(-50%) scale(1); }
    `;
    document.head.appendChild(style);

    // Toast
    const toast = document.createElement('div');
    toast.id = 'one23-toast';
    document.body.appendChild(toast);
    function showToast(html, duration = 3000) {
        toast.innerHTML = html;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), duration);
    }

    const ICONS = {
        cloud: `<svg viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>`,
        check: `<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`,
        save: `💾`,
        close: `×`
    };

    // ================== 123云盘官网逻辑 (悬浮球) ==================
    if (IS_123) {
        // 关键逻辑：只在特定页面显示
        if (!IS_123_HOME) return;

        // 创建容器
        const container = document.createElement('div');
        container.id = 'one23-float-container';

        // 主按钮
        const mainBtn = document.createElement('div');
        mainBtn.id = 'btn-123-token-update';
        mainBtn.innerHTML = `<span class="fab-icon">${ICONS.cloud}</span>`;
        mainBtn.title = '点击同步登录Token给动漫花园助手';

        // 关闭按钮
        const closeBtn = document.createElement('div');
        closeBtn.id = 'btn-123-close';
        closeBtn.innerHTML = ICONS.close;
        closeBtn.title = '关闭悬浮球';

        container.appendChild(mainBtn);
        container.appendChild(closeBtn);
        document.body.appendChild(container);

        // 关闭逻辑
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            container.classList.add('hiding');
            setTimeout(() => container.remove(), 500);
        };

        // 更新逻辑
        mainBtn.onclick = () => {
            let token = localStorage.getItem('authorToken');
            if (!token) {
                try {
                    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
                    token = userInfo.token;
                } catch(e){}
            }

            if (token && token.length > 50) {
                GM_setValue('123_token', token);

                // 成功动画
                mainBtn.classList.add('success');
                mainBtn.innerHTML = `<span class="fab-icon">${ICONS.check}</span>`;
                showToast(`✅ Token 同步成功！`);

                // 1.5秒后自动消失
                setTimeout(() => {
                    container.classList.add('hiding');
                    setTimeout(() => container.remove(), 500);
                }, 1500);
            } else {
                showToast('❌ 未检测到登录状态，请先登录');
            }
        };
        return;
    }

    // ================== 动漫花园逻辑 (保持不变) ==================

    function getToken() { return GM_getValue('123_token', null); }

    function openAuthPage() {
        if (confirm("⚠️ 需要更新 123云盘 授权\n\n点击【确定】打开官网，点击右下角悬浮球即可同步。")) {
            GM_openInTab('https://www.123pan.com/', { active: true });
        }
    }

    function request(method, url, data) {
        return new Promise((resolve, reject) => {
            const token = getToken();
            if (!token) return reject("NO_TOKEN");

            GM_xmlhttpRequest({
                method: method,
                url: "https://www.123pan.com" + url,
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'App-Version': '3',
                    'platform': 'web',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Origin': 'https://www.123pan.com',
                    'Referer': 'https://www.123pan.com/'
                },
                data: JSON.stringify(data),
                onload: function(response) {
                    if (response.status === 401) return reject("TOKEN_EXPIRED");
                    try { resolve(JSON.parse(response.responseText)); } catch (e) { reject("JSON解析失败"); }
                },
                onerror: (err) => reject("网络连接失败")
            });
        });
    }

    async function handleSaveTo123(magnetLink, btnElement) {
        const originalHTML = btnElement.innerHTML;
        btnElement.disabled = true;
        btnElement.innerHTML = `<span class="btn-123-icon">⏳</span> 解析...`;

        try {
            const resolveData = await request('POST', '/b/api/v2/offline_download/task/resolve', { urls: magnetLink });
            if (resolveData.code !== 0) throw new Error(resolveData.message);
            const taskInfo = resolveData.data.list[0];
            if (taskInfo.err_code !== 0) throw new Error(`Code:${taskInfo.err_code}`);

            btnElement.innerHTML = `<span class="btn-123-icon">🚀</span> 转存...`;
            const fileIds = taskInfo.files.map(f => f.id);
            const submitData = await request('POST', '/b/api/v2/offline_download/task/submit', {
                resource_list: [{ resource_id: taskInfo.id, select_file_id: fileIds }]
            });

            if (submitData.code === 0) {
                btnElement.innerHTML = `<span class="btn-123-icon">✅</span> 成功`;
                btnElement.style.background = '#00b894';
                btnElement.style.backgroundImage = 'none';
                showToast(`🎉 成功添加 ${fileIds.length} 个文件`);
                setTimeout(() => { btnElement.disabled = false; }, 3000);
            } else {
                throw new Error(submitData.message);
            }
        } catch (error) {
            btnElement.innerHTML = originalHTML;
            btnElement.disabled = false;
            if (error === "NO_TOKEN" || error === "TOKEN_EXPIRED") openAuthPage();
            else showToast("❌ " + (error.message || error));
        }
    }

    function createButton(magnetLink) {
        const btn = document.createElement('a');
        btn.href = 'javascript:void(0);';
        btn.className = 'btn-123-save';
        btn.innerHTML = `<span class="btn-123-icon">${ICONS.save}</span> 转存123盘`;
        btn.onclick = (e) => {
            e.preventDefault();
            handleSaveTo123(magnetLink, btn);
        };
        return btn;
    }

    // 注入逻辑：镜像站
    function injectMirrorSite() {
        document.querySelectorAll('input.form-control-plaintext').forEach(input => {
            const rowDiv = input.closest('.form-group.row');
            if (!rowDiv) return;
            const label = rowDiv.querySelector('label');
            if (!label || !label.innerText.toLowerCase().includes('magnet')) return;
            const btnContainer = rowDiv.querySelector('div:last-child');
            if (!btnContainer || btnContainer.querySelector('.btn-123-save')) return;
            const btn = createButton(input.value.trim());
            btnContainer.appendChild(btn);
        });
    }

    // 注入逻辑：主站
    function injectMainSite() {
        ['#a_magnet', '#magnet2'].forEach(selector => {
            const linkNode = document.querySelector(selector);
            if (linkNode && !linkNode.nextSibling?.classList?.contains('btn-123-save')) {
                const href = linkNode.getAttribute('href');
                if (href && href.startsWith('magnet:')) {
                    const btn = createButton(href);
                    linkNode.parentNode.insertBefore(btn, linkNode.nextSibling);
                }
            }
        });
    }

    function mainLoop() {
        if (IS_MIRROR) injectMirrorSite();
        else injectMainSite();
    }

    setInterval(mainLoop, 800);
})();