// ==UserScript==
// @name         Bilibili 关注分组导出 & 飞书同步
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  支持增量同步：仅添加新增关注，不删除或覆盖飞书已有数据。支持多选字段。
// @author       BiliTools
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com/*
// @run-at       document-idle
// @icon         https://www.bilibili.com/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559002/Bilibili%20%E5%85%B3%E6%B3%A8%E5%88%86%E7%BB%84%E5%AF%BC%E5%87%BA%20%20%E9%A3%9E%E4%B9%A6%E5%90%8C%E6%AD%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/559002/Bilibili%20%E5%85%B3%E6%B3%A8%E5%88%86%E7%BB%84%E5%AF%BC%E5%87%BA%20%20%E9%A3%9E%E4%B9%A6%E5%90%8C%E6%AD%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 全局配置 ---
    const CONFIG = {
        btnId: 'bili-tools-btn-V20',
        panelId: 'bili-tools-panel-V20',
        checkInterval: 1500
    };

    let myMid = null;
    let allGroups = [];
    let isProcessing = false;

    // --- 样式美化 ---
    const css = `
        #${CONFIG.btnId} {
            position: fixed; bottom: 80px; right: 30px; z-index: 2147483647;
            padding: 10px 18px; background: #00AEEC; color: #fff;
            border-radius: 50px; cursor: pointer; font-size: 14px; font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,174,236,0.4); transition: all 0.3s;
            display: flex; align-items: center; gap: 6px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        #${CONFIG.btnId}:hover { background: #009CD6; transform: translateY(-2px); }
        #${CONFIG.panelId} {
            position: fixed; bottom: 140px; right: 30px; z-index: 2147483647;
            width: 320px; background: #fff; border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.15); padding: 20px;
            display: none; font-family: sans-serif; font-size: 13px; color: #333;
            max-height: 85vh; overflow-y: auto; border: 1px solid #f0f0f0;
        }
        .bili-title { font-size: 16px; font-weight: 800; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px; color: #222; }
        .bili-section { margin-bottom: 15px; }
        .bili-label { display: block; margin-bottom: 5px; font-weight: bold; color: #555; }
        select, input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; margin-bottom: 8px; outline: none; transition: 0.2s;}
        select:focus, input:focus { border-color: #00AEEC; }
        .bili-btn {
            width: 100%; padding: 10px; background: #00AEEC; color: white;
            border: none; border-radius: 6px; cursor: pointer; font-weight: bold; margin-top: 5px;
        }
        .bili-btn-feishu { background: #00D6B9; margin-top: 10px;}
        .bili-btn-feishu:hover { background: #00C2A8; }
        .bili-btn:disabled { background: #ccc; cursor: not-allowed; }
        #bili-log {
            margin-top: 15px; height: 160px; overflow-y: auto;
            background: #f7f9fa; padding: 10px; border-radius: 6px; border: 1px solid #eee;
            font-size: 12px; color: #666; white-space: pre-wrap; line-height: 1.5; font-family: monospace;
        }
    `;

    // --- 网络请求核心 ---
    function gmRequest(url, method = "GET", data = null, headers = {}) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: method, url: url,
                headers: { "User-Agent": navigator.userAgent, "Referer": "https://www.bilibili.com/", ...headers },
                data: data ? JSON.stringify(data) : null,
                onload: (res) => {
                    try { resolve(JSON.parse(res.responseText)); }
                    catch (e) { reject(new Error("JSON解析失败")); }
                },
                onerror: () => reject(new Error("网络请求失败"))
            });
        });
    }

    // --- UI 渲染引擎 ---
    function initUI() {
        if (document.getElementById(CONFIG.btnId)) return;

        if (!document.getElementById('bili-V20-css')) {
            const s = document.createElement('style');
            s.id = 'bili-V20-css'; s.innerHTML = css;
            document.head.appendChild(s);
        }

        const btn = document.createElement('div');
        btn.id = CONFIG.btnId;
        btn.innerHTML = '📂 导出/同步';
        btn.onclick = togglePanel;
        document.body.appendChild(btn);

        const panel = document.createElement('div');
        panel.id = CONFIG.panelId;
        panel.innerHTML = `
            <div class="bili-title">B站关注管理</div>

            <div class="bili-section">
                <span class="bili-label">当前账号: <span id="bili-uname" style="color:#00AEEC;font-weight:normal">检测中...</span></span>
                <select id="bili-group-select"><option value="-999">请先登录...</option></select>
                <button id="bili-export-btn" class="bili-btn">📥 导出 Excel 表格</button>
            </div>

            <div class="bili-section" style="border-top:1px dashed #eee; padding-top:15px;">
                <span class="bili-label">☁️ 飞书多维表格同步 (增量)</span>
                <input id="fs-app-id" placeholder="App ID (cli_...)" />
                <input id="fs-app-secret" type="password" placeholder="App Secret" />
                <input id="fs-app-token" placeholder="Base Token" />
                <input id="fs-table-id" placeholder="Table ID" />
                <button id="bili-sync-btn" class="bili-btn bili-btn-feishu">🚀 检查并同步新增关注</button>
            </div>

            <div id="bili-log"></div>
        `;
        document.body.appendChild(panel);

        // 恢复配置
        document.getElementById('fs-app-id').value = GM_getValue('fs_app_id', '');
        document.getElementById('fs-app-secret').value = GM_getValue('fs_app_secret', '');
        document.getElementById('fs-app-token').value = GM_getValue('fs_app_token', '');
        document.getElementById('fs-table-id').value = GM_getValue('fs_table_id', '');

        document.getElementById('bili-export-btn').onclick = startExport;
        document.getElementById('bili-sync-btn').onclick = startSync;

        log("准备就绪。增量模式已启用。");
    }

    function log(msg) {
        const el = document.getElementById('bili-log');
        if (el) {
            el.innerText += `[${new Date().toLocaleTimeString()}] ${msg}\n`;
            el.scrollTop = el.scrollHeight;
        }
    }

    // --- B站业务逻辑 ---
    async function checkLogin() {
        try {
            const res = await gmRequest('https://api.bilibili.com/x/web-interface/nav');
            if (res.code === 0 && res.data.isLogin) {
                myMid = res.data.mid;
                const el = document.getElementById('bili-uname');
                if (el) el.innerText = res.data.uname;
                return true;
            }
            return false;
        } catch (e) { return false; }
    }

    async function fetchGroups() {
        try {
            const res = await gmRequest('https://api.bilibili.com/x/relation/tags');
            if (res.code !== 0) return log("获取分组失败");
            allGroups = [{ tagid: -999, name: "【全部分组】(自动去重)" }, { tagid: -10, name: "特别关注" }, { tagid: 0, name: "默认分组" }];
            if (res.data) res.data.forEach(g => allGroups.push({ tagid: g.tagid, name: g.name }));
            const select = document.getElementById('bili-group-select');
            select.innerHTML = '';
            allGroups.forEach(g => {
                const opt = document.createElement('option');
                opt.value = g.tagid;
                opt.innerText = g.name;
                select.appendChild(opt);
            });
        } catch (e) { log(e.message); }
    }

    async function fetchUsersByTag(tagid, tagName) {
        let page = 1, hasMore = true, users = [];
        while (hasMore) {
            try {
                const res = await gmRequest(`https://api.bilibili.com/x/relation/tag?mid=${myMid}&tagid=${tagid}&pn=${page}&ps=20`);
                if (res.code !== 0 || !res.data || res.data.length === 0) {
                    hasMore = false;
                } else {
                    res.data.forEach(u => users.push({ mid: u.mid, uname: u.uname, sign: u.sign, group: tagName }));
                    log(`..[${tagName}] 获取第 ${page} 页`);
                    page++;
                    await new Promise(r => setTimeout(r, 200));
                }
            } catch (e) { hasMore = false; }
        }
        return users;
    }

    async function getAllData(mode) {
        const selectedVal = parseInt(document.getElementById('bili-group-select').value);
        let finalDataMap = new Map();

        const mergeData = (users) => {
            users.forEach(u => {
                if (finalDataMap.has(u.mid)) {
                    const exist = finalDataMap.get(u.mid);
                    if (!exist.groups.includes(u.group)) exist.groups.push(u.group);
                } else {
                    finalDataMap.set(u.mid, { mid: u.mid, uname: u.uname, sign: u.sign, groups: [u.group] });
                }
            });
        };

        log("🚀 开始抓取B站最新关注...");
        if (selectedVal === -999) {
            for (const g of allGroups.slice(1)) await mergeData(await fetchUsersByTag(g.tagid, g.name));
        } else {
            const g = allGroups.find(x => x.tagid === selectedVal);
            await mergeData(await fetchUsersByTag(g.tagid, g.name));
        }

        const list = [];
        finalDataMap.forEach(u => {
            let groupVal = (mode === 'feishu') ? u.groups : u.groups.join(', ');
            list.push({
                "UID": String(u.mid),
                "UP主名称": u.uname,
                "所属分组": groupVal,
                "频道主页": `https://space.bilibili.com/${u.mid}`,
                "个性签名": u.sign ? u.sign.substring(0, 1000) : ""
            });
        });
        return list;
    }

    // --- 飞书增量同步核心逻辑 ---
    async function startSync() {
        if (isProcessing) return;

        const appId = document.getElementById('fs-app-id').value.trim();
        const appSecret = document.getElementById('fs-app-secret').value.trim();
        const appToken = document.getElementById('fs-app-token').value.trim();
        const tableId = document.getElementById('fs-table-id').value.trim();

        if (!appId || !appSecret) return alert("请填写飞书配置");
        GM_setValue('fs_app_id', appId); GM_setValue('fs_app_secret', appSecret);
        GM_setValue('fs_app_token', appToken); GM_setValue('fs_table_id', tableId);

        isProcessing = true;
        const btn = document.getElementById('bili-sync-btn');
        btn.disabled = true; btn.innerText = "⏳ 正在计算差异...";
        document.getElementById('bili-log').innerText = '';

        try {
            // 1. 获取 B站 最新数据
            const biliData = await getAllData('feishu');
            if (biliData.length === 0) throw new Error("B站关注列表为空");
            log(`✅ B站获取完成，共 ${biliData.length} 个关注。`);

            // 2. 获取 Token
            log("正在连接飞书...");
            const tRes = await gmRequest('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', "POST",
                { app_id: appId, app_secret: appSecret }, { "Content-Type": "application/json" });
            if (tRes.code !== 0) throw new Error(`Token错误: ${tRes.msg}`);
            const token = tRes.tenant_access_token;

            // 3. 关键：读取飞书现有 UID (增量对比)
            log("正在读取飞书已有记录...");
            const existingUids = new Set();
            let pageToken = null;
            let hasMore = true;
            let totalFetched = 0;

            while (hasMore) {
                // 每次取500条，只取 UID 字段以加快速度
                let url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records?page_size=500&field_names=["UID"]`;
                if (pageToken) url += `&page_token=${pageToken}`;

                const res = await gmRequest(url, "GET", null, { "Authorization": `Bearer ${token}` });
                if (res.code !== 0) throw new Error(`读取记录失败: ${res.msg}`);

                if (res.data.items) {
                    res.data.items.forEach(record => {
                        // 确保 UID 存在且转换为字符串
                        if (record.fields.UID) existingUids.add(String(record.fields.UID));
                    });
                }

                hasMore = res.data.has_more;
                pageToken = res.data.page_token;
                totalFetched += (res.data.items ? res.data.items.length : 0);
                log(`..已读取 ${totalFetched} 条现有记录`);
            }
            log(`✅ 飞书现有记录读取完毕，共 ${existingUids.size} 条。`);

            // 4. 计算新增数据
            log("正在比对数据...");
            const newRecords = biliData.filter(item => !existingUids.has(item["UID"]));

            if (newRecords.length === 0) {
                log("🎉 没有发现新增关注，数据已是最新！");
                alert("没有发现新增关注，同步完成！");
                return;
            }

            log(`⚡ 发现 ${newRecords.length} 个新增关注，准备写入...`);

            // 5. 写入新增数据
            for (let i = 0; i < newRecords.length; i += 100) {
                const chunk = newRecords.slice(i, i + 100).map(item => ({ fields: item }));
                const wRes = await gmRequest(`https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records/batch_create`,
                    "POST", { records: chunk }, { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" });

                if (wRes.code !== 0) throw new Error(`写入失败: ${wRes.msg}`);
                log(`进度: 已同步 ${Math.min(i + 100, newRecords.length)} / ${newRecords.length}`);
            }

            log("✅ 增量同步成功！");
            alert(`同步成功！新增了 ${newRecords.length} 条记录。`);

        } catch (e) {
            log(`❌ 错误: ${e.message}`);
            if (e.message.includes("UID")) log("提示：请检查飞书表格中是否有名为 UID 的文本列。");
        } finally {
            isProcessing = false;
            btn.disabled = false; btn.innerText = "🚀 检查并同步新增关注";
        }
    }

    async function startExport() {
        if (isProcessing) return; isProcessing = true;
        const btn = document.getElementById('bili-export-btn');
        btn.innerText = "⏳ 生成中...";
        document.getElementById('bili-log').innerText = '';

        try {
            const data = await getAllData('excel');
            if (data.length === 0) throw new Error("无数据");
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            ws['!cols'] = [{wch:15}, {wch:20}, {wch:30}, {wch:40}, {wch:50}];
            XLSX.utils.book_append_sheet(wb, ws, "关注列表");
            const a = document.createElement("a");
            const blob = new Blob([XLSX.write(wb, {bookType:'xlsx', type:'array'})], {type:"application/octet-stream"});
            a.href = URL.createObjectURL(blob);
            a.download = `Bilibili_Follows_${new Date().toISOString().slice(0,10)}.xlsx`;
            a.onclick = e => e.stopPropagation();
            document.body.appendChild(a); a.click(); setTimeout(() => a.remove(), 1000);
            log("✅ Excel 导出完成");
        } catch(e) { log(e.message); }
        isProcessing = false;
        btn.innerText = "📥 导出 Excel 表格";
    }

    function togglePanel() {
        const p = document.getElementById(CONFIG.panelId);
        if (p.style.display === 'none' || !p.style.display) {
            p.style.display = 'block';
            checkLogin().then(ok => ok && fetchGroups());
        } else {
            p.style.display = 'none';
        }
    }

    setInterval(initUI, CONFIG.checkInterval);
    setTimeout(initUI, 1000);

})();