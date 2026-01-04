// ==UserScript==
// @name         豆包网盘批量分享助手
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  自动遍历所有分页获取全部文件
// @author       Crazyuncle
// @match        https://www.doubao.com/chat/drive/*
// @match        https://www.doubao.com/drive/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/560724/%E8%B1%86%E5%8C%85%E7%BD%91%E7%9B%98%E6%89%B9%E9%87%8F%E5%88%86%E4%BA%AB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/560724/%E8%B1%86%E5%8C%85%E7%BD%91%E7%9B%98%E6%89%B9%E9%87%8F%E5%88%86%E4%BA%AB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 配置参数 ===
    const API_BASE_PARAMS = "?version_code=20800&language=zh&device_platform=web&aid=497858&real_aid=497858";
    const API_LIST = `https://www.doubao.com/samantha/aispace/node_info${API_BASE_PARAMS}`;
    const API_SHARE = `https://www.doubao.com/samantha/aispace/share/create${API_BASE_PARAMS}`;

    // 状态存储
    let currentFileList = [];

    // 延时函数
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // === UI 构建 ===
    function createUI() {
        if (document.getElementById('doubao-share-btn')) return;

        // 1. 悬浮按钮
        const btn = document.createElement('button');
        btn.id = 'doubao-share-btn';
        btn.innerText = "打开批量分享助手";
        btn.style.cssText = `
            position: fixed; top: 120px; right: 20px; z-index: 9999;
            padding: 12px 20px; background-color: #ff4d4f; color: white;
            border: none; border-radius: 30px; cursor: pointer; font-weight: bold;
            box-shadow: 0 4px 10px rgba(255, 77, 79, 0.4); transition: transform 0.2s;
        `;
        btn.onmouseover = () => btn.style.transform = "scale(1.05)";
        btn.onmouseout = () => btn.style.transform = "scale(1)";
        document.body.appendChild(btn);

        // 2. 主面板
        const panel = document.createElement('div');
        panel.id = 'doubao-share-panel';
        panel.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 550px; height: 650px; background: white; border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3); z-index: 10000; display: none;
            flex-direction: column; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        `;

        panel.innerHTML = `
            <div style="padding: 20px; background: #fff; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 18px; font-weight: 800; color: #333;">📦 批量分享助手</span>
                <button id="close-btn" style="border:none; background:none; font-size: 24px; cursor: pointer; color: #999;">&times;</button>
            </div>

            <div style="padding: 15px; background: #f9f9f9; border-bottom: 1px solid #eee; display: flex; gap: 15px; align-items: center;">
                <button id="refresh-list-btn" style="flex: 1; padding: 10px 15px; background-color: #00b96b; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px; box-shadow: 0 2px 5px rgba(0,185,107,0.3); display: flex; align-items: center; justify-content: center; gap: 5px;">
                    🔄 加载/刷新当前目录 (支持翻页)
                </button>
                <button id="select-all-btn" style="flex: 0.6; padding: 10px 15px; background-color: #1890ff; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px; box-shadow: 0 2px 5px rgba(24,144,255,0.3);">
                    ✅ 全选 / 全不选
                </button>
            </div>

            <div id="file-list-container" style="flex: 1; overflow-y: auto; padding: 10px; background: #fff;">
                <div style="text-align: center; color: #999; margin-top: 80px; display: flex; flex-direction: column; gap: 10px;">
                    <span style="font-size: 40px;">📂</span>
                    <span>请点击上方绿色按钮加载文件</span>
                </div>
            </div>

            <div style="height: 100px; background: #2b2b2b; color: #76ff03; padding: 10px; overflow-y: auto; font-family: monospace; font-size: 12px; line-height: 1.5;" id="log-console">
                [系统] 准备就绪，等待操作...
            </div>

            <div style="padding: 20px; text-align: right; background: #fff; border-top: 1px solid #eee; display: flex; justify-content: flex-end; align-items: center;">
                <span id="selected-count" style="margin-right: 20px; color: #666; font-weight: 500;">已选: 0</span>
                <button id="start-share-btn" style="padding: 12px 30px; background: #ff4d4f; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 15px; box-shadow: 0 4px 10px rgba(255, 77, 79, 0.3);">🚀 开始提取链接</button>
            </div>
        `;
        document.body.appendChild(panel);

        // 事件绑定
        btn.onclick = () => { panel.style.display = 'flex'; };
        document.getElementById('close-btn').onclick = () => { panel.style.display = 'none'; };

        const addClickEffect = (element) => {
            element.onmousedown = () => element.style.transform = "scale(0.96)";
            element.onmouseup = () => element.style.transform = "scale(1)";
            element.onmouseleave = () => element.style.transform = "scale(1)";
        };

        const refreshBtn = document.getElementById('refresh-list-btn');
        refreshBtn.onclick = loadFileList;
        addClickEffect(refreshBtn);

        const selectAllBtn = document.getElementById('select-all-btn');
        selectAllBtn.onclick = () => {
            const checkboxes = document.querySelectorAll('.doubao-file-cb');
            if (checkboxes.length === 0) return;
            const isAllChecked = Array.from(checkboxes).every(cb => cb.checked);
            checkboxes.forEach(cb => cb.checked = !isAllChecked);
            updateCount();
        };
        addClickEffect(selectAllBtn);

        const startBtn = document.getElementById('start-share-btn');
        startBtn.onclick = startBatchShare;
        addClickEffect(startBtn);
    }

    // === 辅助函数 ===
    function log(msg) {
        const consoleDiv = document.getElementById('log-console');
        const time = new Date().toLocaleTimeString();
        consoleDiv.innerHTML += `<div><span style="opacity:0.6">[${time}]</span> ${msg}</div>`;
        consoleDiv.scrollTop = consoleDiv.scrollHeight;
    }

    function getCurrentFolderId() {
        const match = window.location.href.match(/\/drive\/(\d+)/);
        return match ? match[1] : null;
    }

    function updateCount() {
        const count = document.querySelectorAll('.doubao-file-cb:checked').length;
        document.getElementById('selected-count').innerText = `已选: ${count} 个文件`;
    }

    // === 核心逻辑: 获取文件列表 (支持翻页) ===
    async function loadFileList() {
        const folderId = getCurrentFolderId();
        const container = document.getElementById('file-list-container');

        if (!folderId) {
            log("❌ 无法获取文件夹ID，请确保你在文件夹页面内。");
            return;
        }

        container.innerHTML = '<div style="text-align:center; padding: 40px; color: #666;">🔄 正在遍历所有分页...</div>';

        // 重置状态
        currentFileList = [];
        let cursor = ""; // 初始 cursor 为空或 undefined
        let hasMore = true;
        let page = 1;

        log(`开始加载文件夹 (ID: ${folderId})`);

        try {
            // 循环获取直到没有更多页
            while (hasMore) {
                log(`📡 正在请求第 ${page} 页...`);

                // 构造 Payload
                const payload = {
                    "node_id": folderId,
                    "need_full_path": false,
                    "sort_param": { "need_sort_config": true, "sort_order": 1, "sort_type": 0 },
                    "size": 50 // 固定每页 50 条
                };

                // 如果有 cursor，则添加到请求中
                if (cursor && cursor !== "-1") {
                    payload.cursor = cursor;
                }

                const response = await fetch(API_LIST, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (data.code === 0 && data.data) {
                    const newFiles = data.data.children || [];
                    currentFileList = currentFileList.concat(newFiles);
                    log(` -> 第 ${page} 页获取 ${newFiles.length} 个文件`);

                    // 更新翻页状态
                    hasMore = data.data.has_more;
                    cursor = data.data.next_cursor;

                    // 防御性判断：如果 cursor 是 -1 也表示结束
                    if (cursor === "-1") {
                        hasMore = false;
                    }

                    page++;
                    // 稍微延时，防止请求过快
                    await sleep(200);
                } else {
                    throw new Error(data.msg || "接口返回异常");
                }
            }

            log(`✅ 全部加载完毕！共发现 ${currentFileList.length} 个文件。`);
            renderList(currentFileList);

        } catch (e) {
            container.innerHTML = `<div style="color:red; text-align:center; padding: 20px;">加载失败: ${e.message}</div>`;
            log(`❌ 加载中断: ${e.message}`);
        }
    }

    // === 渲染列表到悬浮窗 ===
    function renderList(files) {
        const container = document.getElementById('file-list-container');
        container.innerHTML = '';

        if (files.length === 0) {
            container.innerHTML = '<div style="text-align:center; color:#999; padding: 40px;">此文件夹为空</div>';
            return;
        }

        files.forEach(file => {
            const row = document.createElement('div');
            row.style.cssText = `
                display: flex; align-items: center; padding: 12px 10px;
                border-bottom: 1px solid #f5f5f5; cursor: pointer; transition: background 0.2s;
            `;
            row.onmouseover = () => row.style.background = "#f0f7ff";
            row.onmouseout = () => row.style.background = "transparent";

            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.className = 'doubao-file-cb';
            cb.value = file.id;
            cb.dataset.name = file.name;
            cb.style.cssText = "margin-right: 12px; transform: scale(1.2); cursor: pointer;";
            cb.onchange = updateCount;

            const icon = document.createElement('span');
            icon.innerText = file.node_type === 1 ? '📁' : '📄';
            icon.style.marginRight = '10px';
            icon.style.fontSize = '16px';

            const name = document.createElement('span');
            name.innerText = file.name;
            name.style.flex = 1;
            name.style.overflow = 'hidden';
            name.style.textOverflow = 'ellipsis';
            name.style.whiteSpace = 'nowrap';
            name.style.fontSize = '14px';
            name.style.color = '#333';
            name.title = file.name;

            row.onclick = (e) => {
                if (e.target !== cb) {
                    cb.checked = !cb.checked;
                    updateCount();
                }
            };

            row.appendChild(cb);
            row.appendChild(icon);
            row.appendChild(name);
            container.appendChild(row);
        });
        updateCount();
    }

    // === 核心逻辑: 批量分享 ===
    async function startBatchShare() {
        const checkboxes = document.querySelectorAll('.doubao-file-cb:checked');
        if (checkboxes.length === 0) {
            alert("请至少选择一个文件！");
            return;
        }

        const btn = document.getElementById('start-share-btn');
        const refreshBtn = document.getElementById('refresh-list-btn');

        btn.disabled = true;
        refreshBtn.disabled = true;
        btn.innerText = "⏳ 处理中...";
        btn.style.opacity = "0.7";

        const results = [];
        log("------------------------");
        log(`开始处理 ${checkboxes.length} 个任务...`);

        for (let i = 0; i < checkboxes.length; i++) {
            const cb = checkboxes[i];
            const fileId = cb.value;
            const fileName = cb.dataset.name;

            log(`[${i+1}/${checkboxes.length}] 正在分享: ${fileName}`);

            try {
                const response = await fetch(API_SHARE, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ "node_list": [{"id": fileId}] })
                });
                const data = await response.json();

                if (data.code === 0 && data.data?.share?.share_id) {
                    const link = `https://www.doubao.com/drive/s/${data.data.share.share_id}`;
                    // 去除后缀 + 使用 $ 分隔
                    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
                    const resultLine = `${nameWithoutExt}$${link}`;

                    results.push(resultLine);
                    log(` -> 成功`);
                } else {
                    log(` -> 失败: ${data.msg}`);
                }
            } catch (e) {
                log(` -> 异常: ${e.message}`);
            }

            await sleep(800 + Math.random() * 800);
        }

        log("------------------------");
        log("🎉 所有任务完成！正在复制到剪贴板...");

        const resultText = results.join('\n');
        GM_setClipboard(resultText);
        alert(`完成！共获取 ${results.length} 个链接。\n已自动复制到剪贴板。`);

        log("=== 最终结果 ===");
        results.forEach(r => log(r));

        btn.disabled = false;
        refreshBtn.disabled = false;
        btn.innerText = "🚀 开始提取链接";
        btn.style.opacity = "1";
    }

    window.addEventListener('load', () => setTimeout(createUI, 1000));

    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            if(!document.getElementById('doubao-share-btn')) {
                createUI();
            }
        }
    }, 1000);

})();