// ==UserScript==
// @name         Bilibili批量自动拉黑/取关工具
// @namespace    https://github.com/Lanzy1029/bilibili-batch-blocker
// @version      1.2.0
// @description  输入昵称或UID，自动转换并执行拉黑/取关操作。
// @author       Lanzzzy
// @license      MIT
// @match        https://www.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://t.bilibili.com/*
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      api.bilibili.com
// @downloadURL https://update.greasyfork.org/scripts/561575/Bilibili%E6%89%B9%E9%87%8F%E8%87%AA%E5%8A%A8%E6%8B%89%E9%BB%91%E5%8F%96%E5%85%B3%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/561575/Bilibili%E6%89%B9%E9%87%8F%E8%87%AA%E5%8A%A8%E6%8B%89%E9%BB%91%E5%8F%96%E5%85%B3%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置区域 ---
    const DELAY_BLOCK_MIN = 1500;
    const DELAY_BLOCK_MAX = 3000;
    const DELAY_SEARCH = 1200;
    // ----------------

    let isProcessing = false; // 全局状态锁

    // 注册菜单：点击后才初始化
    GM_registerMenuCommand("🛡️ 打开批量拉黑面板", () => {
        initPanel();
        const panel = document.getElementById('bili-block-panel');
        panel.style.display = 'block';
    });

    // 懒加载初始化
    function initPanel() {
        if (document.getElementById('bili-block-panel')) return;

        const panelHTML = `
            <div id="bili-block-panel" style="position: fixed; top: 100px; right: 20px; width: 340px; background: #fff; border: 1px solid #ddd; z-index: 10000; padding: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 8px; font-family: sans-serif;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h3 style="margin: 0; color: #fb7299; font-size: 16px; font-weight: bold;">🛡️ 批量拉黑/转换工具</h3>
                    <span id="close-block-btn" style="cursor: pointer; font-size: 20px; color: #999; line-height: 1;">×</span>
                </div>
                
                <div style="font-size: 12px; color: #666; margin-bottom: 5px; display:flex; justify-content:space-between;">
                    <span>输入名单 (支持空格/逗号/换行分隔):</span>
                    <a href="https://www.zhihu.com/search?type=content&q=B站%20避雷%20名单" target="_blank" style="color:#00aeec; text-decoration:none;">🔗 寻找名单?</a>
                </div>
                
                <textarea id="block-list-input" placeholder="输入示例：\n老番茄，LexBurner 123456\n(支持中文逗号、英文逗号、空格或换行)\n\n寻找名单可参考知乎话题：\nhttps://www.zhihu.com/question/628880628" style="width: 100%; height: 130px; border: 1px solid #ccc; margin-bottom: 10px; border-radius: 4px; padding: 8px; font-size: 12px; resize: vertical; box-sizing: border-box;"></textarea>
                
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <button id="convert-uid-btn" style="flex: 1; background: #00aeec; color: white; border: none; padding: 8px 0; cursor: pointer; border-radius: 4px; font-size: 13px;">🔄 昵称转UID</button>
                    <button id="start-block-btn" style="flex: 1; background: #fb7299; color: white; border: none; padding: 8px 0; cursor: pointer; border-radius: 4px; font-size: 13px; font-weight: bold;">🚫 开始拉黑</button>
                </div>

                <div style="font-size: 12px; color: #333; margin-bottom: 5px; font-weight: bold;">运行日志:</div>
                <div id="block-log" style="height: 150px; overflow-y: auto; background: #f9f9f9; border: 1px solid #eee; padding: 8px; font-size: 12px; border-radius: 4px; white-space: pre-wrap; word-break: break-all;">
                    <div style="color: #999;">等待操作...</div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', panelHTML);
        bindEvents();
    }

    // 绑定事件
    function bindEvents() {
        const panel = document.getElementById('bili-block-panel');
        const inputArea = document.getElementById('block-list-input');
        const convertBtn = document.getElementById('convert-uid-btn');
        const startBtn = document.getElementById('start-block-btn');
        const closeBtn = document.getElementById('close-block-btn');
        const logDiv = document.getElementById('block-log');

        closeBtn.onclick = () => { panel.style.display = 'none'; };

        function log(msg, color = 'black', isBold = false) {
            const p = document.createElement('div');
            p.style.color = color;
            p.style.marginBottom = '3px';
            if (isBold) p.style.fontWeight = 'bold';
            p.innerText = `[${new Date().toLocaleTimeString()}] ${msg}`;
            logDiv.appendChild(p);
            logDiv.scrollTop = logDiv.scrollHeight;
        }
        function clearLog() { logDiv.innerHTML = ''; }

        // 核心：分割文本的正则
        // 匹配：换行符、空白符、英文逗号、中文逗号
        function splitText(text) {
            return text.split(/[\n\s,，]+/).map(t => t.trim()).filter(t => t);
        }

        // 按钮1：转换
        convertBtn.onclick = async () => {
            if (isProcessing) return;
            const rawText = inputArea.value.trim();
            if (!rawText) return log("❌ 请输入内容", "red");

            const items = splitText(rawText);
            if (items.length === 0) return;

            isProcessing = true;
            toggleBtns(true);
            clearLog();
            log(`🔍 识别到 ${items.length} 个目标，开始转换...`, "blue", true);

            let finalUids = [];
            
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                // 如果是纯数字，直接当做UID
                if (/^\d+$/.test(item)) {
                    finalUids.push(item);
                } else {
                    log(`正在搜索: ${item}...`);
                    const res = await searchUserUid(item);
                    if (res.success) {
                        log(`✅ 找到: ${res.name} (${res.uid})`, "green");
                        finalUids.push(res.uid);
                    } else {
                        log(`❌ 未找到: ${item}`, "red");
                        // 没找到的也保留在列表里，方便用户查看
                        finalUids.push(`${item}(未找到)`);
                    }
                    await sleep(DELAY_SEARCH);
                }
            }
            // 转换完后，用换行符重新整理放回输入框，方便后续拉黑
            inputArea.value = finalUids.join('\n');
            log("转换结束！列表已重置为 UID 格式。", "#00aeec", true);
            isProcessing = false;
            toggleBtns(false);
        };

        // 按钮2：拉黑
        startBtn.onclick = async () => {
            if (isProcessing) return;
            const csrf = getCsrf();
            if (!csrf) return log("❌ 未登录", "red");

            // 提取所有数字 (忽略掉 "未找到" 等文字)
            let uids = inputArea.value.match(/\d+/g);
            if(uids) uids = [...new Set(uids)];

            if (!uids || uids.length === 0) return log("⚠️ 无有效 UID", "orange");

            isProcessing = true;
            toggleBtns(true);
            clearLog();
            log(`🚀 开始拉黑 ${uids.length} 个用户...`, "#fb7299", true);

            let success = 0, fail = 0;
            for (let i = 0; i < uids.length; i++) {
                const uid = uids[i];
                log(`[${i+1}/${uids.length}] 处理 UID: ${uid}`);
                const res = await modifyRelation(uid, csrf);
                if (res.success) {
                    log(`✅ 拉黑成功`, "green");
                    success++;
                } else {
                    log(`❌ 失败: ${res.msg}`, "red");
                    fail++;
                }
                if (i < uids.length - 1) await sleep(Math.floor(Math.random() * (DELAY_BLOCK_MAX - DELAY_BLOCK_MIN + 1)) + DELAY_BLOCK_MIN);
            }
            log(`🎉 结束! 成功:${success} 失败:${fail}`, "blue", true);
            isProcessing = false;
            toggleBtns(false);
        };

        function toggleBtns(disable) {
            convertBtn.disabled = disable;
            startBtn.disabled = disable;
            convertBtn.style.opacity = disable ? 0.6 : 1;
            startBtn.style.opacity = disable ? 0.6 : 1;
        }
    }

    // --- 工具函数 ---
    function getCsrf() {
        let match = document.cookie.match(/bili_jct=([^;]+)/);
        return match ? match[1] : '';
    }
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    function searchUserUid(name) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.bilibili.com/x/web-interface/search/type?search_type=bili_user&keyword=${encodeURIComponent(name)}`,
                headers: { "Referer": "https://www.bilibili.com/" },
                timeout: 5000,
                onload: (res) => {
                    try {
                        const data = JSON.parse(res.responseText);
                        if (data.code === 0 && data.data?.result?.[0]) {
                            resolve({ success: true, uid: data.data.result[0].mid, name: data.data.result[0].uname });
                        } else { resolve({ success: false }); }
                    } catch (e) { resolve({ success: false }); }
                },
                onerror: () => resolve({ success: false })
            });
        });
    }

    function modifyRelation(fid, csrf) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://api.bilibili.com/x/relation/modify",
                headers: { "Content-Type": "application/x-www-form-urlencoded", "Referer": "https://www.bilibili.com/" },
                data: `fid=${fid}&act=5&re_src=11&csrf=${csrf}`,
                onload: (res) => {
                    try {
                        const data = JSON.parse(res.responseText);
                        if (data.code === 0 || data.code === 22002) resolve({ success: true, msg: '' });
                        else resolve({ success: false, msg: data.message });
                    } catch (e) { resolve({ success: false, msg: '解析错' }); }
                },
                onerror: () => resolve({ success: false, msg: '网络错' })
            });
        });
    }
})();