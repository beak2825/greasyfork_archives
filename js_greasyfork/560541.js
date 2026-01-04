// ==UserScript==
// @name         豆包多视频 VID 抓取器 (带文件名)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  自动嗅探页面上的所有视频，显示文件名和 VID，支持批量复制。
// @author       Gemini
// @match        https://www.doubao.com/*
// @grant        GM_setClipboard
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/560541/%E8%B1%86%E5%8C%85%E5%A4%9A%E8%A7%86%E9%A2%91%20VID%20%E6%8A%93%E5%8F%96%E5%99%A8%20%28%E5%B8%A6%E6%96%87%E4%BB%B6%E5%90%8D%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560541/%E8%B1%86%E5%8C%85%E5%A4%9A%E8%A7%86%E9%A2%91%20VID%20%E6%8A%93%E5%8F%96%E5%99%A8%20%28%E5%B8%A6%E6%96%87%E4%BB%B6%E5%90%8D%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储已发现的视频：Map<VID, Name>
    const foundVideos = new Map();

    // --- UI 界面构建 ---
    function createOrUpdatePanel() {
        let panel = document.getElementById('db-multi-vid-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'db-multi-vid-panel';
            panel.style.cssText = `
                position: fixed; top: 80px; right: 20px; z-index: 999999;
                background: rgba(30, 30, 30, 0.95); color: #fff;
                padding: 15px; border-radius: 8px; font-family: sans-serif;
                box-shadow: 0 8px 24px rgba(0,0,0,0.5); border: 1px solid #444;
                width: 320px; max-height: 80vh; display: flex; flex-direction: column;
            `;

            // 标题栏
            const header = document.createElement('div');
            header.style.cssText = "display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #555; padding-bottom:8px;";
            header.innerHTML = `<span style="font-weight:bold; color:#00ff9d;">⚡ 已捕获视频 (<span id="db-count">0</span>)</span>`;

            // 关闭按钮
            const closeBtn = document.createElement('span');
            closeBtn.innerText = "✖";
            closeBtn.style.cssText = "cursor:pointer; color:#aaa; font-size:14px;";
            closeBtn.onclick = () => panel.style.display = 'none';
            header.appendChild(closeBtn);

            panel.appendChild(header);

            // 列表容器
            const listContainer = document.createElement('div');
            listContainer.id = 'db-vid-list';
            listContainer.style.cssText = "overflow-y: auto; flex: 1; padding-right:5px;";
            panel.appendChild(listContainer);

            document.body.appendChild(panel);
        }

        // 更新内容
        const list = document.getElementById('db-vid-list');
        const count = document.getElementById('db-count');

        // 清空列表重新渲染（为了排序）
        list.innerHTML = '';
        count.innerText = foundVideos.size;

        if (foundVideos.size === 0) {
            list.innerHTML = '<div style="color:#777; text-align:center; padding:20px;">等待数据加载...<br>请刷新页面或点击文件夹</div>';
            return;
        }

        foundVideos.forEach((name, vid) => {
            const item = document.createElement('div');
            item.style.cssText = "background:#333; margin-bottom:8px; padding:8px; border-radius:4px; font-size:12px; border-left: 3px solid #2563eb;";

            // 文件名
            const title = document.createElement('div');
            title.innerText = name;
            title.style.cssText = "color:#fff; font-weight:bold; margin-bottom:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;";
            item.appendChild(title);

            // VID 显示
            const vidDisp = document.createElement('div');
            vidDisp.innerText = vid;
            vidDisp.style.cssText = "color:#aaa; font-family:monospace; font-size:11px; margin-bottom:6px; word-break:break-all;";
            item.appendChild(vidDisp);

            // 复制按钮
            const copyBtn = document.createElement('button');
            copyBtn.innerText = "复制 VID";
            copyBtn.style.cssText = "background:#444; color:#fff; border:none; padding:4px 10px; border-radius:3px; cursor:pointer; font-size:11px; width:100%; transition:0.2s;";
            copyBtn.onmouseover = () => copyBtn.style.background = "#2563eb";
            copyBtn.onmouseout = () => copyBtn.style.background = "#444";
            copyBtn.onclick = () => {
                GM_setClipboard(vid);
                copyBtn.innerText = "✅ 已复制";
                copyBtn.style.background = "#10b981";
                setTimeout(() => {
                    copyBtn.innerText = "复制 VID";
                    copyBtn.style.background = "#444";
                }, 2000);
            };
            item.appendChild(copyBtn);

            list.appendChild(item);
        });

        // 如果隐藏了就显示出来
        panel.style.display = 'flex';
    }

    // --- 核心逻辑：递归搜索 JSON ---
    function scanObject(obj) {
        if (!obj || typeof obj !== 'object') return;

        // 1. 检查当前对象是否包含 VID
        // 豆包常见的 VID 字段名：vid, video_id, original_media_id, key
        let vid = obj.vid || obj.video_id || obj.original_media_id;

        // 有时候 vid 藏在 key 字段里，需要正则判断是否是 v0 开头
        if (!vid && obj.key && typeof obj.key === 'string' && obj.key.startsWith('v0')) {
            vid = obj.key;
        }

        // 如果找到了有效的 VID (v0开头，长度够长)
        if (vid && typeof vid === 'string' && vid.startsWith('v0') && vid.length > 20) {
            // 尝试在同一个对象里找文件名
            let name = obj.name || obj.file_name || obj.title || obj.caption || "未命名视频";

            // 如果这个对象只有 vid 没有 name，尝试去上一层找（这里简化处理，只存当前层）
            // 防止重复添加，优先保留名字更长的（通常是完整文件名）
            if (!foundVideos.has(vid) || (foundVideos.get(vid) === "未命名视频" && name !== "未命名视频")) {
                foundVideos.set(vid, name);
                createOrUpdatePanel();
            }
        }

        // 2. 递归遍历子属性 (数组或对象)
        for (let key in obj) {
            if (obj.hasOwnProperty(key) && typeof obj[key] === 'object') {
                scanObject(obj[key]);
            }
        }
    }

    // --- 拦截器 ---

    // 拦截 XHR
    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(body) {
        this.addEventListener('load', function() {
            try {
                // 只有 JSON 响应才解析
                const contentType = this.getResponseHeader("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const data = JSON.parse(this.responseText);
                    scanObject(data);
                }
            } catch (e) {}
        });
        originalSend.apply(this, arguments);
    };

    // 拦截 Fetch
    const originalFetch = window.fetch;
    window.fetch = async function(input, init) {
        const response = await originalFetch(input, init);
        const clone = response.clone();
        clone.json().then(data => {
            scanObject(data);
        }).catch(() => {});
        return response;
    };

    // 初始化面板
    window.addEventListener('load', () => {
        setTimeout(createOrUpdatePanel, 1000);
    });

})();