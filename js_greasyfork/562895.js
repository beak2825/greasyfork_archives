// ==UserScript==
// @name          qBittorrent Tracker Assistant
// @namespace     http://tampermonkey.net/
// @version       2.3.3
// @description   1.扫描失效种子打标；2.tracker地址批量替换；3.按分类批量转移种子（含未分类支持、批量起停、物理移动监控）。
// @author        DRH
// --- 在下方修改或添加您的 qBittorrent 访问地址 ---
// @match         http://192.168.*.*:*/*
// @grant         none
// @run-at        document-end

// @downloadURL https://update.greasyfork.org/scripts/562895/qBittorrent%20Tracker%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/562895/qBittorrent%20Tracker%20Assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.self !== window.top) return;

    let cachedData = [];
    let isTaskRunning = false;
    let initialPathsRecord = {};

    const injectUI = () => {
        if (document.getElementById('qbit-api-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'qbit-api-panel';
        panel.style = "position:fixed;top:10px;right:10px;z-index:2147483647;background:#1a1a1a;color:#fff;border:1px solid #00bcd4;padding:15px;border-radius:10px;width:300px;box-shadow:0 4px 25px rgba(0,0,0,0.5);font-family:sans-serif;font-size:13px;box-sizing:border-box;";

        panel.innerHTML = `
            <span id="close-api-panel" style="position:absolute;top:8px;right:12px;cursor:pointer;color:#888;font-size:20px;font-weight:bold;line-height:1;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#888'">&times;</span>
            <b style="color:#00bcd4;font-size:16px;">qBittorrent 助手 v2.3.3</b><br>

            <div id="main-menu" style="margin-top:15px; display:block; text-align:center;">
                <div style="color:#666; font-size:13px; margin-bottom:15px; border-bottom:1px solid #333; padding-bottom:10px;">请点击下方按钮进行功能选择</div>
                <button id="nav-scan-btn" style="width:80%; cursor:pointer; background:#e91e63; color:white; border:none; padding:12px; font-weight:bold; border-radius:6px; margin:0 auto 15px auto; display:block;">🛡️ 1. 扫描失效种子</button>
                <button id="nav-replace-btn" style="width:80%; cursor:pointer; background:#00bcd4; color:black; border:none; padding:12px; font-weight:bold; border-radius:6px; margin:0 auto 15px auto; display:block;">✏️ 2. 批量更改地址</button>
                <button id="nav-transfer-btn" style="width:80%; cursor:pointer; background:#ffc107; color:black; border:none; padding:12px; font-weight:bold; border-radius:6px; margin:0 auto 15px auto; display:block;">🚚 3. 按分类转移文件</button>
            </div>

            <div id="scan-panel" style="display:none; margin-top:10px;">
                <div style="color:#e91e63; font-weight:bold; font-size:14px; margin-bottom:10px;">🛡️ 扫描失效种子</div>
                <p style="color:#888; font-size:13px; line-height:1.5; font-weight:400; background:#333; padding:8px; border-radius:4px; margin-bottom:12px;">·仅检索[做种]状态的种子；<br>·若种子的每条Tracker都符合勾选条件，则会为该种子打上“失效”标签。</p>
                <div style="margin:15px 0; background:#252525; padding:10px; border-radius:4px; border:1px solid #444;">
                    <label style="display:block; margin-bottom:8px; cursor:pointer;"><input type="checkbox" id="check-peers" checked style="vertical-align:middle; margin-right:5px;"> Peers (用户) 等于 -1</label>
                    <label style="display:block; cursor:pointer;"><input type="checkbox" id="check-status" checked style="vertical-align:middle; margin-right:5px;"> 状态为 “未工作”</label>
                </div>
                <div style="display:flex; gap:5px;">
                    <button id="start-scan-btn" style="flex:2;cursor:pointer;background:#e91e63;color:white;border:none;padding:10px;font-weight:bold;border-radius:4px;">开始扫描</button>
                    <button id="stop-scan-btn" style="flex:1;cursor:pointer;background:#555;color:white;border:none;padding:10px;font-weight:bold;border-radius:4px;">停止</button>
                </div>
                <button class="back-to-menu" style="width:100%;margin-top:10px;background:none;border:1px solid #444;color:#888;cursor:pointer;padding:5px;border-radius:4px;">返回主菜单</button>
            </div>

            <div id="replace-panel" style="display:none; margin-top:10px;">
                <div style="color:#00bcd4; font-weight:bold; font-size:14px; margin-bottom:10px;">✏️ 批量更改地址</div>
                <div id="search-section">
                    <div style="margin-bottom:8px;"><label style="color:#888;">1. 搜索文本 (需包含):</label><input type="text" id="target-text" placeholder="需输入至少8个字符" style="width:100%;box-sizing:border-box;margin-top:5px;padding:6px;background:#333;border:1px solid #444;color:#fff;border-radius:4px;"></div>
                    <div style="margin-bottom:12px;"><label style="color:#888;">2. 排除文本 (选填):</label><input type="text" id="exclude-text" placeholder="不需要排除请留空" style="width:100%;box-sizing:border-box;margin-top:5px;padding:6px;background:#333;border:1px solid #444;color:#fff;border-radius:4px;"></div>
                    <button id="fast-check-btn" style="width:100%;cursor:pointer;background:#00bcd4;color:black;border:none;padding:10px;font-weight:bold;border-radius:4px;">🔍 检索种子</button>
                </div>
                <hr id="divider" style="display:none; border:0; border-top:1px solid #333; margin:15px 0;">
                <div id="modify-section" style="display:none;">
                    <div style="margin-bottom:12px;">
                        <label style="color:#ff9800; font-weight:bold;">3. 替代文本 (替换为):</label>
                        <input type="text" id="replace-text" placeholder="需输入至少8个字符" style="width:100%;box-sizing:border-box;margin-top:5px;padding:6px;background:#333;border:1px solid #ff9800;color:#fff;border-radius:4px;">
                    </div>
                    <div style="display:flex; gap:5px;">
                        <button id="replace-btn" style="flex:2;cursor:pointer;background:#ff9800;color:black;border:none;padding:10px;font-weight:bold;border-radius:4px;">🚀 确认替换</button>
                        <button id="restore-btn" style="flex:1;cursor:pointer;background:#555;color:white;border:none;padding:10px;font-weight:bold;border-radius:4px;">还原</button>
                    </div>
                </div>
                <button class="back-to-menu" style="width:100%;margin-top:10px;background:none;border:1px solid #444;color:#888;cursor:pointer;padding:5px;border-radius:4px;">返回主菜单</button>
            </div>

            <div id="transfer-panel" style="display:none; margin-top:10px;">
                <div style="color:#ffc107; font-weight:bold; font-size:14px; margin-bottom:10px;">🚚 按分类转移文件</div>
                <p style="color:#f44336; font-size:12px; line-height:1.5; font-weight:bold; background:#333; padding:8px; border-radius:4px; margin-bottom:12px;">·此功能容易导致文件混乱，务必谨慎操作！</p>
                <div style="display:flex; gap:5px; margin-bottom:12px;">
                    <button id="import-cat-btn" style="flex:2; cursor:pointer; background:#ffc107; color:black; border:none; padding:10px; font-weight:bold; border-radius:4px;">导入全部分类</button>
                    <button id="recover-path-btn" style="flex:1; cursor:pointer; background:#555; color:white; border:none; padding:10px; font-weight:bold; border-radius:4px; display:none;">路径复原</button>
                </div>
                <div id="cat-list-container" style="max-height:300px; overflow-y:auto; background:#222; padding:5px; border-radius:4px; margin-bottom:12px; display:none; border:1px solid #444;">
                    <label style="display:block; border-bottom:1px solid #333; padding-bottom:5px; margin-bottom:5px; cursor:pointer;">
                        <input type="checkbox" id="check-all-cats" style="vertical-align:middle; margin-right:5px;"> [全选 / 取消全选]
                    </label>
                    <div id="cat-items-list"></div>
                </div>
                <div id="batch-action-section" style="display:none; display:flex; gap:5px; margin-bottom:10px;">
                    <button id="batch-pause-btn" style="flex:1; cursor:pointer; background:#555; color:white; border:none; padding:10px; font-weight:bold; border-radius:4px;">暂停种子</button>
                    <button id="batch-resume-btn" style="flex:1; cursor:pointer; background:#00bcd4; color:black; border:none; padding:10px; font-weight:bold; border-radius:4px;">继续做种</button>
                </div>
                <button id="transfer-execute-btn" style="width:100%;cursor:pointer;background:#555;color:#888;border:none;padding:12px;font-weight:bold;border-radius:6px;display:none;margin-bottom:5px;">一键转移</button>
                <button class="back-to-menu" style="width:100%;margin-top:10px;background:none;border:1px solid #444;color:#888;cursor:pointer;padding:5px;border-radius:4px;">返回主菜单</button>
            </div>

            <div id="api-status" style="font-size:12px;margin-top:10px;color:#aaa;background:#222;padding:8px;border-radius:4px;min-height:45px;white-space:pre-wrap;line-height:1.4;">请选择功能开始操作...</div>
        `;
        document.body.appendChild(panel);

        document.getElementById('nav-scan-btn').onclick = () => showPanel('scan-panel');
        document.getElementById('nav-replace-btn').onclick = () => showPanel('replace-panel');
        document.getElementById('nav-transfer-btn').onclick = () => showPanel('transfer-panel');
        document.querySelectorAll('.back-to-menu').forEach(btn => {
            btn.onclick = () => { isTaskRunning = false; showPanel('main-menu'); setStatus("已返回主菜单"); };
        });
        document.getElementById('import-cat-btn').onclick = importCategories;
        document.getElementById('recover-path-btn').onclick = recoverSelectedPaths;
        document.getElementById('batch-pause-btn').onclick = () => batchAction('pause');
        document.getElementById('batch-resume-btn').onclick = () => batchAction('resume');
        document.getElementById('transfer-execute-btn').onclick = startTransferLogic;
        document.getElementById('start-scan-btn').onclick = runBrokenSeedScan;
        document.getElementById('stop-scan-btn').onclick = () => { isTaskRunning = false; setStatus("已停止扫描。"); };
        document.getElementById('fast-check-btn').onclick = fastSearch;
        document.getElementById('replace-btn').onclick = () => runModify('replace');
        document.getElementById('restore-btn').onclick = () => runModify('restore');
        document.getElementById('close-api-panel').onclick = () => { isTaskRunning = false; panel.remove(); };
    };

    const showPanel = (id) => {
        ['main-menu', 'scan-panel', 'replace-panel', 'transfer-panel'].forEach(pid => {
            document.getElementById(pid).style.display = (pid === id) ? 'block' : 'none';
        });
        if (id !== 'main-menu') setStatus("");
    };

    const setStatus = (msg) => { document.getElementById('api-status').innerText = msg; };

    // ================= 功能 3: 转移与批量起停逻辑 =================
    async function importCategories() {
        setStatus("🚀 正在获取分类及路径...");
        const listDiv = document.getElementById('cat-items-list');
        listDiv.innerHTML = "";
        initialPathsRecord = {};
        try {
            const categories = await (await fetch('/api/v2/torrents/categories')).json();
            const torrents = await (await fetch('/api/v2/torrents/info')).json();

            let catNames = Object.keys(categories);
            if (torrents.some(t => t.category === "")) {
                catNames.push("未分类");
            }

            if (catNames.length === 0) { setStatus("ℹ️ 未发现分类。"); return; }

            catNames.forEach(name => {
                const searchName = name === "未分类" ? "" : name;
                const sample = torrents.find(t => t.category === searchName);
                const path = sample ? sample.save_path : "";
                initialPathsRecord[name] = path;
                const row = document.createElement('div');
                row.style = "display:flex; align-items:center; gap:5px; margin-bottom:8px; padding-bottom:5px; border-bottom:1px solid #333;";
                row.innerHTML = `
                    <input type="checkbox" class="cat-sel-check" data-cat="${name}" style="flex:0 0 18px;">
                    <div style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:bold;" title="${name}">${name}</div>
                    <input type="text" class="cat-path-input" data-cat="${name}" value="${path}" style="flex:2; box-sizing:border-box; padding:4px; background:#333; border:1px solid #555; color:#fff; border-radius:3px; font-size:11px;">
                `;
                listDiv.appendChild(row);
            });

            document.getElementById('cat-list-container').style.display = "block";
            document.getElementById('recover-path-btn').style.display = "block";
            document.getElementById('batch-action-section').style.display = "flex";
            const exeBtn = document.getElementById('transfer-execute-btn');
            exeBtn.style.display = "block"; exeBtn.style.background = "#ffc107"; exeBtn.style.color = "black"; exeBtn.innerText = "一键转移";

            document.getElementById('check-all-cats').onclick = (e) => {
                document.querySelectorAll('.cat-sel-check').forEach(cb => cb.checked = e.target.checked);
            };
            setStatus(`✅ 成功导入 ${catNames.length} 个分类（含未分类）。`);
        } catch (e) { setStatus("❌ 导入失败: " + e.message); }
    }

    function recoverSelectedPaths() {
        const selected = Array.from(document.querySelectorAll('.cat-sel-check:checked'));
        if (selected.length === 0) { alert("请勾选分类！"); return; }
        selected.forEach(cb => {
            const catName = cb.getAttribute('data-cat');
            const input = document.querySelector(`.cat-path-input[data-cat="${catName}"]`);
            if (input) input.value = initialPathsRecord[catName];
        });
        setStatus(`🔄 已复原勾选分类的初始路径。`);
    }

    // 优化后的批量起停：使用增量筛选
    async function batchAction(type) {
        const selected = Array.from(document.querySelectorAll('.cat-sel-check:checked'));
        if (selected.length === 0) { alert("请先勾选分类！"); return; }

        setStatus(`🚀 正在执行批量${type === 'pause' ? '暂停' : '启动'}...`);
        try {
            let allHashes = [];
            // 增量逻辑：按勾选的分类精准拉取，不再下载全量几千个种子的包
            for (const cb of selected) {
                const catName = cb.getAttribute('data-cat');
                const apiCatName = catName === "未分类" ? "" : catName;
                const resp = await fetch(`/api/v2/torrents/info?category=${encodeURIComponent(apiCatName)}`);
                const torrents = await resp.json();
                allHashes.push(...torrents.map(t => t.hash));
            }

            if (allHashes.length > 0) {
                const fd = new FormData(); fd.append('hashes', allHashes.join('|'));
                await fetch(`/api/v2/torrents/${type}`, { method: 'POST', body: fd });
                setStatus(`🏁 操作成功！处理种子数: ${allHashes.length} 个。`);
            } else { setStatus("ℹ️ 所选分类下无种子。"); }
        } catch (e) { setStatus("❌ 操作失败: " + e.message); }
    }

    // 优化后的转移逻辑：配合增量筛选统计
    async function startTransferLogic() {
        const btn = document.getElementById('transfer-execute-btn');
        if (btn.innerText === "一键转移") {
            btn.disabled = true; btn.style.background = "#555"; btn.style.color = "#888";
            let sec = 3; btn.innerText = `再次确认 (${sec})`;
            const timer = setInterval(() => {
                sec--;
                if (sec > 0) { btn.innerText = `再次确认 (${sec})`; setStatus(`⚠️ 路径校验中，${sec}秒后解锁...`); }
                else { clearInterval(timer); btn.innerText = "确认无误，开始转移"; btn.disabled = false; btn.style.background = "#f44336"; btn.style.color = "white"; setStatus("🔴 路径已解锁。"); }
            }, 1000);
            return;
        }

        const selected = Array.from(document.querySelectorAll('.cat-sel-check:checked'));
        if (selected.length === 0) { alert("请勾选分类！"); return; }

        isTaskRunning = true; btn.style.display = "none";
        try {
            setStatus("📊 正在统计待处理总量...");
            let total = 0;
            let catTorrentsMap = {};

            // 增量统计
            for (const cb of selected) {
                const name = cb.getAttribute('data-cat');
                const apiName = name === "未分类" ? "" : name;
                const resp = await fetch(`/api/v2/torrents/info?category=${encodeURIComponent(apiName)}`);
                const torrents = await resp.json();
                catTorrentsMap[name] = torrents;
                total += torrents.length;
            }

            let current = 0;
            for (let i = 0; i < selected.length; i++) {
                if (!isTaskRunning) break;
                const catDispName = selected[i].getAttribute('data-cat');
                const path = document.querySelector(`.cat-path-input[data-cat="${catDispName}"]`).value.trim();
                const hashes = catTorrentsMap[catDispName].map(t => t.hash);

                if (hashes.length > 0) {
                    const fd = new FormData(); fd.append('hashes', hashes.join('|')); fd.append('location', path);
                    await fetch('/api/v2/torrents/setLocation', { method: 'POST', body: fd });
                    current += hashes.length;
                    setStatus(`[${i+1}/${selected.length}] 指令已下发: ${catDispName}\n进度: ${current} / ${total} 个种子`);
                }
                await new Promise(r => setTimeout(r, 800));
            }

            if (isTaskRunning) {
                setStatus(`✅ 指令发送成功 (${total} 个)！监控硬盘移动中...`);
                while (isTaskRunning) {
                    const checkTorrents = await (await fetch('/api/v2/torrents/info')).json();
                    const movingCount = checkTorrents.filter(t => t.state === 'moving').length;
                    if (movingCount === 0) break;
                    setStatus(`🏁 指令已全部下发。\n🚚 硬盘正在移动剩余 ${movingCount} 个种子...`);
                    await new Promise(r => setTimeout(r, 3000));
                }
                setStatus(`🏁 序贯转移及物理移动已彻底执行完毕！`);
            }
        } catch (e) { setStatus("❌ 转移过程出错: " + e.message); }
        isTaskRunning = false; btn.style.display = "block"; btn.innerText = "一键转移"; btn.style.background = "#ffc107"; btn.style.color = "black";
    }

    async function runBrokenSeedScan() {
        if (isTaskRunning) return;
        const useP = document.getElementById('check-peers').checked, useS = document.getElementById('check-status').checked;
        if (!useP && !useS) { alert("⚠️ 请勾选条件！"); return; }
        isTaskRunning = true; setStatus("🚀 扫描中...");
        try {
            const torrents = await (await fetch('/api/v2/torrents/info?filter=seeding')).json();
            let broken = [], count = torrents.length, chunk = 30;
            for (let i = 0; i < count; i += chunk) {
                if (!isTaskRunning) break;
                const res = await Promise.all(torrents.slice(i, i + chunk).map(async t => {
                    try {
                        const trs = await (await fetch(`/api/v2/torrents/trackers?hash=${t.hash}`)).json();
                        const real = trs.filter(tr => tr.url.startsWith('http') || tr.url.startsWith('udp'));
                        if (real.length > 0 && real.every(tr => (useP && tr.num_peers === -1) || (useS && (tr.status === 1 || tr.msg.includes("未工作"))))) return t.hash;
                    } catch(e) {} return null;
                }));
                broken.push(...res.filter(h => h));
                setStatus(`扫描进度: ${Math.min(i + chunk, count)}/${count}\n失效发现: ${broken.length}`);
                await new Promise(r => setTimeout(r, 5));
            }
            if (isTaskRunning && broken.length > 0) {
                const fd = new FormData(); fd.append('hashes', broken.join('|')); fd.append('tags', '失效');
                await fetch('/api/v2/torrents/addTags', { method: 'POST', body: fd });
                setStatus(`🏁 完成！已标记 ${broken.length} 个。`);
            } else if (isTaskRunning) setStatus("🏁 扫描完成。");
        } catch(e) { setStatus("❌ 扫描出错: " + e.message); } isTaskRunning = false;
    }

    async function fastSearch() {
        const target = document.getElementById('target-text').value.trim(), exclude = document.getElementById('exclude-text').value.trim();
        if (target.length < 8) { alert("⚠️ ≥8 字符！"); return; }
        setStatus("🚀 检索中..."); cachedData = [];
        document.getElementById('modify-section').style.display = 'none'; document.getElementById('divider').style.display = 'none';
        try {
            const torrents = await (await fetch('/api/v2/torrents/info')).json();
            for (let i = 0; i < torrents.length; i += 25) {
                const res = await Promise.all(torrents.slice(i, i + 25).map(async t => ({ t, tr: await (await fetch(`/api/v2/torrents/trackers?hash=${t.hash}`)).json() })));
                for (const item of res) {
                    const urls = item.tr.map(u => u.url);
                    if (urls.some(u => u.includes(target)) && !(exclude && urls.some(u => u.includes(exclude)))) {
                        const hit = item.tr.find(u => u.url.includes(target));
                        cachedData.push({ hash: item.t.hash, name: item.t.name, oldUrl: hit.url });
                    }
                }
                setStatus(`进度: ${Math.min(i + 25, torrents.length)}/${torrents.length}\n匹配: ${cachedData.length}`);
            }
            if (cachedData.length > 0) { document.getElementById('modify-section').style.display = 'block'; document.getElementById('divider').style.display = 'block'; setStatus(`✅ 找到 ${cachedData.length} 个。`); }
            else setStatus("ℹ️ 未发现。");
        } catch(e) { setStatus("❌ 错误: " + e.message); }
    }

    async function runModify(mode) {
        let a = document.getElementById('target-text').value.trim(), b = document.getElementById('replace-text').value.trim();
        if (b.length < 8) { alert("⚠️ ≥8 字符！"); return; }
        if (mode === 'restore') [a, b] = [b, a];
        setStatus(`执行中...`); let count = 0; isTaskRunning = true;
        for (const item of cachedData) {
            if (!isTaskRunning) break;
            const fd = new FormData(); fd.append('hash', item.hash); fd.append('origUrl', item.oldUrl); fd.append('newUrl', item.oldUrl.replace(a, b));
            await fetch('/api/v2/torrents/editTracker', { method: 'POST', body: fd });
            count++; if (count % 5 === 0) setStatus(`进度: ${count}/${cachedData.length}`);
            await new Promise(r => setTimeout(r, 50));
        }
        setStatus(`🏁 完成！共处理 ${count} 个。`); isTaskRunning = false;
    }

    injectUI();
})();