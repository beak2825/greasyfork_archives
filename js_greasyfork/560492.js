// ==UserScript==
// @name         Jellyfin 真实视频下载
// @namespace    https://greasyfork.org/zh-CN/users/1546436-zasternight
// @version      2.2
// @description  在Jellyfin详情页和更多菜单添加下载按钮。智能适配IDM，强制转换Strm为视频格式下载。
// @author       zasternight
// @license MIT
// @match        http://localhost:8096/web/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/560492/Jellyfin%20%E7%9C%9F%E5%AE%9E%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/560492/Jellyfin%20%E7%9C%9F%E5%AE%9E%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // ================= 配置区 =================
    const FORCE_STATIC = true; // 强制不转码 (直接读取源文件)
    const DEFAULT_EXT = 'mkv'; // 无法识别时的默认后缀
    // =========================================
    let currentContextItemId = null;
    // 获取认证信息
    function getAuthInfo() {
        try {
            const raw = localStorage.getItem('jellyfin_credentials');
            if (!raw) return null;
            const data = JSON.parse(raw);
            if (data.Servers && data.Servers.length > 0) {
                const server = data.Servers[0];
                if (server && server.AccessToken && server.UserId) {
                    return {
                        UserId: server.UserId,
                        AccessToken: server.AccessToken,
                        DeviceId: server.DeviceId || 'TampermonkeyScript'
                    };
                }
            }
        } catch (e) {
            console.error("Auth Error", e);
        }
        return null;
    }
    // 核心下载逻辑
    async function triggerDownload(itemId) {
        if (!itemId) {
            alert("未获取到媒体ID");
            return;
        }
        const auth = getAuthInfo();
        if (!auth) {
            alert("请先登录 Jellyfin");
            return;
        }
        const serverUrl = window.location.origin;
        const headers = {
            'Authorization': `MediaBrowser Client="Jellyfin Web", Device="Tampermonkey", DeviceId="${auth.DeviceId}", Version="1.0.0", Token="${auth.AccessToken}"`
        };
        try {
            // 1. 获取 Item 详情
            const response = await fetch(`${serverUrl}/Users/${auth.UserId}/Items/${itemId}`, { headers });
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            const data = await response.json();
            if (!data.MediaSources || data.MediaSources.length === 0) {
                alert("无可用媒体源");
                return;
            }
            const source = data.MediaSources[0];
            // 2. 准备文件名
            let extension = source.Container;
            // 修正后缀
            if (!extension || extension.toLowerCase() === 'strm') {
                if (source.Path && source.Path.includes('.')) {
                    const parts = source.Path.split('.');
                    const pathExt = parts[parts.length - 1].toLowerCase();
                    // 常见视频格式白名单
                    if (['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'iso', 'ts'].includes(pathExt)) {
                        extension = pathExt;
                    } else {
                        extension = DEFAULT_EXT;
                    }
                } else {
                    extension = DEFAULT_EXT;
                }
            }
            // 净化文件名
            const cleanName = (data.Name || "video").replace(/[<>:"/\\|?*]/g, "");
            const finalFilename = `${cleanName}.${extension}`;
            let finalUrl = "";
            // 3. 策略选择
            // 策略A：如果是 HTTP 直链 Strm，直接给 IDM 原始地址 (最快，文件名最准)
            if (source.Path && source.Path.startsWith('http') && source.Protocol === 'Http') {
                console.log("检测到直链 Strm，使用原始地址");
                finalUrl = source.Path;
            }
            // 策略B：通过 Jellyfin 中转 (本地文件或挂载盘)
            else {
                // 构造 API 地址
                // 注意：这里去掉了 .extension，防止 IDM 误判 path 为文件名
                let downloadUrl = `${serverUrl}/Videos/${itemId}/stream`;
                const params = new URLSearchParams();
                params.append('static', FORCE_STATIC);
                params.append('mediaSourceId', source.Id);
                params.append('deviceId', auth.DeviceId);
                params.append('api_key', auth.AccessToken);
                params.append('attachment', 'true'); // 强制下载头
                params.append('filename', finalFilename); // 服务器端设置 Content-Disposition

                if (source.Container && source.Container.toLowerCase() !== 'strm') {
                    params.append('container', source.Container);
                } else {
                    params.append('container', extension);
                }
                // 【关键修改】将文件名作为一个伪参数放在 URL 的最后
                // IDM 的正则非常倾向于将 URL 末尾的 xxx.mkv 识别为文件名
                finalUrl = `${downloadUrl}?${params.toString()}&idm_fix=${encodeURIComponent(finalFilename)}`;
            }
            console.log("IDM Link:", finalUrl);
            // 4. 触发下载
            const link = document.createElement('a');
            link.href = finalUrl;
            // 设置 download 属性，IDM 浏览器插件通常会读取这个属性
            link.setAttribute('download', finalFilename);
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
                document.body.removeChild(link);
            }, 100);
        } catch (e) {
            console.error(e);
            alert("获取链接失败: " + e.message);
        }
    }
    // 注入详情页按钮
    function injectDetailButton() {
        const container = document.querySelector('.mainDetailButtons') || document.querySelector('.detailButtons');
        if (!container || document.getElementById('idm-dl-btn')) return;
        const itemId = new URLSearchParams(window.location.hash.split('?')[1]).get('id');
        if (!itemId) return;
        const btn = document.createElement('button');
        btn.id = 'idm-dl-btn';
        btn.className = 'raised btn-background paper-button button-flat detailButton emby-button';
        btn.innerHTML = '<span class="material-icons detailButton-icon">file_download</span><span class="button-text">真实下载</span>';
        btn.title = "调用IDM下载源文件";
        btn.style.marginRight = '0.5em';
        btn.onclick = (e) => {
            e.preventDefault();
            btn.innerHTML = '解析中...';
            triggerDownload(itemId).then(() => {
                setTimeout(() => btn.innerHTML = '<span class="material-icons detailButton-icon">file_download</span><span class="button-text">真实下载</span>', 2000);
            });
        };
        container.appendChild(btn);
    }
    // 注入更多菜单按钮
    function injectActionSheet(scroller) {
        if (scroller.querySelector('button[data-id="idm-dl"]')) return;
        // 简单校验是否是媒体菜单
        if (!scroller.querySelector('button[data-id="download"]') && !scroller.querySelector('button[data-id="play"]')) return;
        let targetId = currentContextItemId;
        if (!targetId && window.location.hash.includes('id=')) {
            targetId = new URLSearchParams(window.location.hash.split('?')[1]).get('id');
        }
        if (!targetId) return;
        const btn = document.createElement('button');
        btn.setAttribute('is', 'emby-button');
        btn.className = 'listItem listItem-button actionSheetMenuItem emby-button';
        btn.setAttribute('data-id', 'idm-dl');
        btn.innerHTML = `
            <span class="actionsheetMenuItemIcon listItemIcon listItemIcon-transparent material-icons file_download" aria-hidden="true"></span>
            <div class="listItemBody actionsheetListItemBody">
                <div class="listItemBodyText actionSheetItemText">真实下载 (IDM)</div>
            </div>
        `;
        btn.onclick = () => {
            triggerDownload(targetId);
            // 关闭菜单
            const backdrop = document.querySelector('.dialogBackdrop');
            if(backdrop) backdrop.click();
        };
        const refBtn = scroller.querySelector('button[data-id="download"]');
        if (refBtn) refBtn.parentNode.insertBefore(btn, refBtn.nextSibling);
        else scroller.insertBefore(btn, scroller.firstChild);
    }
    // 事件监听
    document.addEventListener('click', (e) => {
        const card = e.target.closest('[data-id]');
        if (card) currentContextItemId = card.getAttribute('data-id');
    }, true);
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
            if (m.addedNodes.length) {
                if (document.querySelector('.mainDetailButtons')) injectDetailButton();
                m.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        const scroller = node.classList?.contains('actionSheetScroller') ? node : node.querySelector?.('.actionSheetScroller');
                        if (scroller) injectActionSheet(scroller);
                    }
                });
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(injectDetailButton, 1000);
})();
