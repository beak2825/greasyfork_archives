// ==UserScript==
// @name         qBittorrent Tracker Assistant
// @namespace    http://tampermonkey.net/
// @version      1.6 
// @description  批量替换qBittorrent中某些tracker的指定字符；增加 8 字符最小限制防止误操作，支持右上角关闭面板。
// @author       DRH
// --- 在下方修改或添加您的 qBittorrent 访问地址 ---
// @match        http://192.168.*.*:*/*
//
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/562895/qBittorrent%20Tracker%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/562895/qBittorrent%20Tracker%20Assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.self !== window.top) return;

    let cachedData = [];

    const injectUI = () => {
        if (document.getElementById('qbit-api-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'qbit-api-panel';
        panel.innerHTML = `
            <div style="position:fixed;top:10px;right:10px;z-index:2147483647;background:#1a1a1a;color:#fff;border:1px solid #00bcd4;padding:15px;border-radius:10px;width:280px;box-shadow:0 4px 25px rgba(0,0,0,0.5);font-family:sans-serif;font-size:13px;">
                <span id="close-api-panel" style="position:absolute;top:8px;right:12px;cursor:pointer;color:#888;font-size:20px;font-weight:bold;line-height:1;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#888'">&times;</span>
                
                <b style="color:#00bcd4;font-size:16px;">qB tracker修改助手 v1.4</b><br>

                <div id="search-section" style="margin-top:10px;">
                    <div style="margin-bottom:8px;">
                        <label style="color:#888;">1. 搜索文本 (需包含):</label>
                        <input type="text" id="target-text" placeholder="需输入至少8个字符"
                               style="width:100%;margin-top:5px;padding:6px;background:#333;border:1px solid #444;color:#fff;border-radius:4px;">
                    </div>
                    <div style="margin-bottom:12px;">
                        <label style="color:#888;">2. 排除文本 (选填):</label>
                        <input type="text" id="exclude-text" placeholder="不需要排除请留空"
                               style="width:100%;margin-top:5px;padding:6px;background:#333;border:1px solid #444;color:#fff;border-radius:4px;">
                    </div>
                    <button id="fast-check-btn" style="width:100%;cursor:pointer;background:#00bcd4;color:black;border:none;padding:10px;font-weight:bold;border-radius:4px;">🔍 检索种子</button>
                </div>

                <hr id="divider" style="display:none; border:0; border-top:1px solid #333; margin:15px 0;">

                <div id="modify-section" style="display:none;">
                    <div style="margin-bottom:12px;">
                        <label style="color:#ff9800; font-weight:bold;">3. 替代文本 (替换为):</label>
                        <input type="text" id="replace-text" placeholder="需输入至少8个字符"
                               style="width:100%;margin-top:5px;padding:6px;background:#333;border:1px solid #ff9800;color:#fff;border-radius:4px;">
                    </div>
                    <div style="display:flex; gap:5px;">
                        <button id="replace-btn" style="flex:2;cursor:pointer;background:#ff9800;color:black;border:none;padding:10px;font-weight:bold;border-radius:4px;">🚀 确认替换</button>
                        <button id="restore-btn" style="flex:1;cursor:pointer;background:#555;color:white;border:none;padding:10px;font-weight:bold;border-radius:4px;">还原</button>
                    </div>
                </div>

                <div id="api-status" style="font-size:12px;margin-top:10px;color:#aaa;background:#222;padding:8px;border-radius:4px;min-height:40px;white-space:pre-wrap;line-height:1.4;">请输入完整 Tracker 关键词进行检索...</div>
            </div>
        `;
        document.body.appendChild(panel);

        // 绑定按钮事件
        document.getElementById('fast-check-btn').onclick = fastSearch;
        document.getElementById('replace-btn').onclick = () => runModify('replace');
        document.getElementById('restore-btn').onclick = () => runModify('restore');
        
        // 绑定关闭按钮事件
        document.getElementById('close-api-panel').onclick = () => {
            panel.remove();
        };
    };

    const setStatus = (msg) => { document.getElementById('api-status').innerText = msg; };

    async function fastSearch() {
        const target = document.getElementById('target-text').value.trim();
        const exclude = document.getElementById('exclude-text').value.trim();

        if (target.length < 8) {
            alert("⚠️ 为了安全，搜索文本必须至少输入 8 个字符！\n（请填入具体的 Tracker 域名或完整地址）");
            return;
        }
        if (exclude.length > 0 && exclude.length < 8) {
            alert("⚠️ 排除文本如果不为空，则必须至少输入 8 个字符！");
            return;
        }

        setStatus("🚀 正在扫描符合条件的种子...");
        cachedData = [];
        document.getElementById('modify-section').style.display = 'none';
        document.getElementById('divider').style.display = 'none';

        try {
            const torrents = await (await fetch('/api/v2/torrents/info')).json();
            const chunkSize = 25;

            for (let i = 0; i < torrents.length; i += chunkSize) {
                const chunk = torrents.slice(i, i + chunkSize);
                const results = await Promise.all(chunk.map(async (t) => {
                    const trResp = await fetch(`/api/v2/torrents/trackers?hash=${t.hash}`);
                    const trackers = await trResp.json();
                    return { t, trackers };
                }));

                for (const item of results) {
                    const urls = item.trackers.map(tr => tr.url);
                    const hasTarget = urls.some(u => u.includes(target));
                    const hasExclude = exclude && urls.some(u => u.includes(exclude));

                    if (hasTarget && !hasExclude) {
                        const targetTracker = item.trackers.find(tr => tr.url.includes(target));
                        cachedData.push({
                            hash: item.t.hash,
                            name: item.t.name,
                            oldUrl: targetTracker.url
                        });
                    }
                }
                setStatus(`检索进度: ${Math.min(i + chunkSize, torrents.length)}/${torrents.length}\n找到待处理: ${cachedData.length} 个`);
            }

            if (cachedData.length > 0) {
                document.getElementById('modify-section').style.display = 'block';
                document.getElementById('divider').style.display = 'block';
                setStatus(`✅ 检索完成！\n找到 ${cachedData.length} 个符合条件的种子。\n\n提示：这些种子均包含 "${target}"${exclude ? ` 且不含 "${exclude}"` : ''}。`);
            } else {
                let reason = exclude
                    ? `(即: 所有包含 "${target}" 的种子都已经含有 "${exclude}" 了)`
                    : `(即: 未在任何种子中发现包含 "${target}" 的 Tracker 地址)`;
                setStatus(`ℹ️ 未找到符合条件的种子。\n${reason}`);
            }
        } catch (e) { setStatus("❌ 接口请求错误: " + e.message); }
    }

    async function runModify(mode) {
        let boxA = document.getElementById('target-text').value.trim();
        let boxB = document.getElementById('replace-text').value.trim();

        if (boxB.length < 8) {
            alert("⚠️ 替代文本必须至少输入 8 个字符！");
            return;
        }

        if (mode === 'restore') [boxA, boxB] = [boxB, boxA];

        setStatus(`正在执行操作...`);
        let count = 0;

        for (const item of cachedData) {
            const newUrl = item.oldUrl.replace(boxA, boxB);
            const formData = new FormData();
            formData.append('hash', item.hash);
            formData.append('origUrl', item.oldUrl);
            formData.append('newUrl', newUrl);

            await fetch('/api/v2/torrents/editTracker', { method: 'POST', body: formData });

            count++;
            if (count % 5 === 0) setStatus(`进度: ${count}/${cachedData.length}`);
            await new Promise(r => setTimeout(r, 50));
        }

        setStatus(`🏁 任务成功完成！\n已处理 ${count} 个种子。`);
        document.getElementById('modify-section').style.display = 'none';
        document.getElementById('divider').style.display = 'none';
        cachedData = [];
    }

    injectUI();
})();