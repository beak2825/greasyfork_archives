// ==UserScript==
// @name         论坛考古掘金 (增强拟人化)
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  NodeLoc专用。重构阅读和触底逻辑，滚动平滑、停顿自然，极大降低提前退出风险。
// @author       Gemini_User & Gemini
// @match        https://www.nodeloc.com/*
// @match        https://nodeloc.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558014/%E8%AE%BA%E5%9D%9B%E8%80%83%E5%8F%A4%E6%8E%98%E9%87%91%20%28%E5%A2%9E%E5%BC%BA%E6%8B%9F%E4%BA%BA%E5%8C%96%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558014/%E8%AE%BA%E5%9D%9B%E8%80%83%E5%8F%A4%E6%8E%98%E9%87%91%20%28%E5%A2%9E%E5%BC%BA%E6%8B%9F%E4%BA%BA%E5%8C%96%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- ⚙️ 参数配置 ---
    const CONFIG = {
        homeUrl: "https://www.nodeloc.com/latest",
        // [调整] 更平滑、更慢的拟人化滚动参数
        scrollStepMin: 250,                  // 最小滚动步长 (px) - 减小步长
        scrollStepMax: 500,                  // 最大滚动步长 (px) - 减小步长
        scrollIntervalMin: 1200,             // 最小停顿间隔 (ms) - 增加停顿
        scrollIntervalMax: 2500,             // 最大停顿间隔 (ms) - 增加停顿
        bottomStay: 2500,                    // ⏱️ 触底后停留时间
        // [调整] 触底检测更宽容
        stuckLimit: 20,                      // 到底检测灵敏度 (连续卡顿次数)
        maxSearchScroll: 50,                 // 列表页最大下钻次数
        storageKey: 'nodeloc_history_v2.3',  // 历史记录key (版本更新)
        statusKey: 'nodeloc_running_v2.3'    // 运行状态key
    };

    // --- 📊 状态记录 ---
    let state = {
        isRunning: localStorage.getItem(CONFIG.statusKey) === '1',
        searchAttempts: 0,
        visited: new Set()
    };

    // --- 🛠️ 辅助函数 ---
    const Utils = {
        randomInRange: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    };

    // --- 🖥️ UI 控制面板 (无变动) ---
    const UI = {
        init: function() {
            const div = document.createElement('div');
            div.style.cssText = `position: fixed; bottom: 20px; right: 20px; z-index: 10000; background: #2f3542; color: #fff; padding: 15px; border-radius: 8px; font-family: sans-serif; font-size: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); border: 1px solid #57606f; min-width: 160px; text-align: center;`;
            const btnColor = state.isRunning ? "#ff4757" : "#2ed573";
            const btnText = state.isRunning ? "停止考古" : "开始极速";
            const statusText = state.isRunning ? "⚡ 极速运行" : "🍵 已就绪";
            div.innerHTML = `<div style="font-weight:bold; color:#ffa502; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;"><span>⚡ NodeLoc 极速版</span><span id="nl-clear" style="cursor:pointer; font-size:14px;" title="清除历史记录">🗑️</span></div><div id="nl-msg" style="margin-bottom:5px; color:#dfe4ea;">${statusText}</div><div id="nl-debug" style="margin-bottom:10px; color:#a4b0be; font-size:10px;">等待启动...</div><button id="nl-btn" style="width:100%; padding:8px; cursor:pointer; background:${btnColor}; border:none; color:#fff; border-radius:4px; font-weight:bold;">${btnText}</button><div style="margin-top:5px; font-size:10px; color:#747d8c;">去重库: <span id="nl-v-count">0</span></div>`;
            document.body.appendChild(div);
            const btn = document.getElementById('nl-btn');
            const clearBtn = document.getElementById('nl-clear');
            setInterval(() => { const el = document.getElementById('nl-v-count'); if (el) el.innerText = state.visited.size; }, 2000);
            clearBtn.onclick = () => { if (confirm('要清除已读记录重新刷吗？')) { state.visited.clear(); localStorage.removeItem(CONFIG.storageKey); UI.log("🗑️ 记录已清空"); UI.debug("请重新点击开始"); } };
            btn.onclick = () => {
                state.isRunning = !state.isRunning;
                localStorage.setItem(CONFIG.statusKey, state.isRunning ? '1' : '0');
                if (state.isRunning) { btn.innerText = "停止考古"; btn.style.background = "#ff4757"; UI.log("🚀 引擎启动..."); Core.start(); }
                else { btn.innerText = "开始极速"; btn.style.background = "#2ed573"; UI.log("🛑 已停止"); setTimeout(() => location.reload(), 500); }
            };
        },
        log: msg => { const el = document.getElementById('nl-msg'); if (el) el.innerText = msg; },
        debug: msg => { const el = document.getElementById('nl-debug'); if (el) el.innerText = msg; }
    };

    // --- 💾 存储管理 (无变动) ---
    const Storage = {
        load: function() { try { const raw = localStorage.getItem(CONFIG.storageKey); if (!raw) return; const data = JSON.parse(raw); const now = Date.now(); const expiry = 3 * 24 * 60 * 60 * 1000; Object.keys(data).forEach(u => { if (now - data[u] < expiry) state.visited.add(u); }); } catch (e) { console.error("NodeLoc Script: Failed to load history.", e); } },
        save: function(url) { state.visited.add(url); const data = {}; if (state.visited.size > 2500) { const oldKeys = Array.from(state.visited).slice(0, 500); oldKeys.forEach(k => state.visited.delete(k)); } state.visited.forEach(u => data[u] = Date.now()); localStorage.setItem(CONFIG.storageKey, JSON.stringify(data)); }
    };

    // --- 🚀 核心逻辑 ---
    const Core = {
        start: function() { Storage.load(); this.router(); },
        router: function() {
            if (!state.isRunning) return;
            if (/\/t\/[^\/]+\/\d+/.test(window.location.pathname)) { this.readPost(); }
            else if (window.location.pathname.includes('/latest') || window.location.pathname.includes('/top')) { this.scanList(); }
            else { UI.log("🔄 前往Latest..."); window.location.href = CONFIG.homeUrl; }
        },

        // [优化] 🟢 扫描列表 (逻辑微调)
        scanList: async function() {
            UI.log("🔍 扫描中...");
            await new Promise(r => setTimeout(r, 1500));
            const checkAndScroll = async () => {
                if (!state.isRunning) return;
                const links = Array.from(document.querySelectorAll('.topic-list-item .raw-topic-link'));
                const unread = links.filter(l => !state.visited.has(l.href));
                UI.debug(`发现:${links.length} | 未读:${unread.length} | 下钻:${state.searchAttempts}`);
                if (unread.length > 0) {
                    state.searchAttempts = 0; const target = unread[0]; UI.log(`进入: ${target.innerText.trim().substring(0, 8)}...`); Storage.save(target.href); window.location.href = target.href; return;
                }
                state.searchAttempts++;
                if (state.searchAttempts > CONFIG.maxSearchScroll) { UI.log("⚠️ 翻页太多，刷新重置..."); setTimeout(() => location.reload(), 5000); return; }
                UI.log(`✅ 全已读，第 ${state.searchAttempts} 次下钻...`);
                window.scrollBy(0, window.innerHeight * 0.8);
                setTimeout(checkAndScroll, 2000);
            };
            checkAndScroll();
        },

        // [重构] 🔵 阅读帖子 (全新拟人化滚动与触底逻辑)
        readPost: function() {
            UI.log("📖 模拟阅读...");
            let lastHeight = 0;
            let stuckCount = 0;
            let scrollTimeout;

            const performHumanScroll = () => {
                if (!state.isRunning) { clearTimeout(scrollTimeout); return; }

                // --- 1. 定义结束条件 ---
                const scrollPos = window.scrollY + window.innerHeight;
                const currentHeight = document.documentElement.scrollHeight;

                // 主要结束标志：帖子底部的推荐、地图或按钮区已进入视野
                const footerElement = document.querySelector('#suggested-topics, .topic-map, #topic-footer-buttons');
                const isFooterVisible = footerElement && footerElement.getBoundingClientRect().top < window.innerHeight;

                // 辅助结束标志：滚动条在页面底部“卡住”了
                // 只有当滚动条位置 > 95% 时，才开始计算卡顿
                if (scrollPos / currentHeight > 0.95 && Math.abs(currentHeight - lastHeight) < 10) {
                    stuckCount++;
                } else {
                    stuckCount = 0; // 页面仍在加载或未到底，重置计数
                }
                lastHeight = currentHeight;

                // --- 2. 判断是否阅读完毕 ---
                if (isFooterVisible || stuckCount >= CONFIG.stuckLimit) {
                    const reason = isFooterVisible ? "检测到页脚" : "滚动条卡住";
                    UI.log(`✅ 阅读完毕 (${reason})`);
                    clearTimeout(scrollTimeout);
                    setTimeout(() => {
                        if (state.isRunning) window.location.href = CONFIG.homeUrl;
                    }, CONFIG.bottomStay);
                    return; // 结束滚动
                }

                // --- 3. 执行拟人化滚动 ---
                const scrollAmount = Utils.randomInRange(CONFIG.scrollStepMin, CONFIG.scrollStepMax);
                window.scrollBy(0, scrollAmount);
                UI.debug(`滚动:${scrollAmount}px | 卡顿:${stuckCount}/${CONFIG.stuckLimit}`);

                // --- 4. 安排下一次滚动 ---
                const nextScrollDelay = Utils.randomInRange(CONFIG.scrollIntervalMin, CONFIG.scrollIntervalMax);
                scrollTimeout = setTimeout(performHumanScroll, nextScrollDelay);
            };

            // 延迟启动，给帖子一个初始加载时间
            scrollTimeout = setTimeout(performHumanScroll, 2000);
        }
    };

    // --- 初始化 ---
    window.addEventListener('load', () => {
        UI.init();
        if (state.isRunning) { setTimeout(() => Core.start(), 1500); }
    });

    // SPA 路由监听
    let lastUrl = window.location.href;
    setInterval(() => {
        if (state.isRunning && window.location.href !== lastUrl) {
            lastUrl = window.location.href;
            setTimeout(() => Core.router(), 2000);
        }
    }, 1000);
})();
