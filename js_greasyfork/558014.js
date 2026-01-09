// ==UserScript==
// @name         Linux.do 考古掘金 (稳定慢速版)
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  专治1000楼长贴。调整了滚动速度以适配慢网速，并修复了重复刷帖的Bug。
// @author       Gemini_User & Gemini Enterprise
// @match        https://linux.do/*
// @match        https://www.linux.do/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558014/Linuxdo%20%E8%80%83%E5%8F%A4%E6%8E%98%E9%87%91%20%28%E7%A8%B3%E5%AE%9A%E6%85%A2%E9%80%9F%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558014/Linuxdo%20%E8%80%83%E5%8F%A4%E6%8E%98%E9%87%91%20%28%E7%A8%B3%E5%AE%9A%E6%85%A2%E9%80%9F%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- ⚙️ 参数配置 ---
    const CONFIG = {
        homeUrl: "https://linux.do/latest",
        scrollStep: 200,                     // 🐌 滚动步长减小 (更平滑)
        scrollInterval: 1500,                // ⏱️ 间隔延长至 1.5秒 (适配慢网速)
        bottomStay: 3000,                    // 到底后多停一会儿 (3秒)
        maxWaitTime: 180,                    // 针对慢网速，死磕时间延长到 180秒
        maxSearchScroll: 50,                 
        storageKey: 'linuxdo_history_v3',    
        statusKey: 'linuxdo_running_v3'
    };

    let state = {
        isRunning: localStorage.getItem(CONFIG.statusKey) === '1',
        searchAttempts: 0,
        visited: new Set()
    };

    // 工具：提取干净的 URL (去除参数和结尾斜杠)
    const normalizeUrl = (url) => {
        try {
            const u = new URL(url);
            return u.origin + u.pathname.replace(/\/+$/, "");
        } catch(e) { return url; }
    };

    // --- 📊 UI 控制面板 ---
    const UI = {
        init: function() {
            const div = document.createElement('div');
            div.style.cssText = `
                position: fixed; bottom: 20px; right: 20px; z-index: 10000;
                background: #1a1a1a; color: #fff; padding: 15px; border-radius: 8px;
                font-family: sans-serif; font-size: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.5);
                border: 1px solid #444; min-width: 160px; text-align: center;
            `;

            const btnColor = state.isRunning ? "#e74c3c" : "#2ecc71";
            const btnText = state.isRunning ? "停止运行" : "开始掘金";

            div.innerHTML = `
                <div style="font-weight:bold; color:#f1c40f; margin-bottom:8px; display:flex; justify-content:space-between;">
                    <span>考古掘金 V3.1</span>
                    <span id="ld-clear" style="cursor:pointer;" title="清空记录">🗑️</span>
                </div>
                <div id="ld-msg" style="margin-bottom:8px; color:#bdc3c7;">载入中...</div>
                <button id="ld-btn" style="width:100%; padding:8px; cursor:pointer; background:${btnColor}; border:none; color:#fff; border-radius:4px; font-weight:bold;">${btnText}</button>
                <div style="margin-top:5px; font-size:10px; color:#666;">已读数量: <span id="ld-v-count">0</span></div>
            `;
            document.body.appendChild(div);

            const btn = document.getElementById('ld-btn');
            document.getElementById('ld-clear').onclick = () => {
                if(confirm('清空已读历史？')) {
                    localStorage.removeItem(CONFIG.storageKey);
                    location.reload();
                }
            };

            btn.onclick = () => {
                state.isRunning = !state.isRunning;
                localStorage.setItem(CONFIG.statusKey, state.isRunning ? '1' : '0');
                location.reload();
            };
            
            this.updateCount();
        },
        log: function(msg) {
            const el = document.getElementById('ld-msg');
            if(el) el.innerText = msg;
        },
        updateCount: function() {
            const el = document.getElementById('ld-v-count');
            if(el) el.innerText = state.visited.size;
        }
    };

    // --- 💾 存储管理 ---
    const Storage = {
        load: function() {
            try {
                const raw = localStorage.getItem(CONFIG.storageKey);
                if(raw) {
                    const data = JSON.parse(raw);
                    Object.keys(data).forEach(u => state.visited.add(u));
                }
            } catch(e){}
        },
        save: function(url) {
            const cleanUrl = normalizeUrl(url);
            state.visited.add(cleanUrl);
            const data = {};
            // 限制存储 2000 条，防止撑爆
            let list = Array.from(state.visited).slice(-2000);
            list.forEach(u => data[u] = Date.now());
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(data));
        }
    };

    // --- 🚀 核心逻辑 ---
    const Core = {
        start: function() {
            Storage.load();
            this.router();
        },

        router: function() {
            if(!state.isRunning) {
                UI.log("已停止");
                return;
            }

            // 1. 如果在帖子内
            if(/\/t\/.*?\/\d+/.test(window.location.pathname)) {
                this.readPost();
                return;
            }

            // 2. 首页/列表页逻辑
            this.scanList();
        },

        scanList: async function() {
            UI.log("正在寻找未读帖子...");
            await new Promise(r => setTimeout(r, 2500)); // 等待列表加载

            const links = Array.from(document.querySelectorAll('.topic-list-item .raw-topic-link'));
            const unread = links.filter(l => !state.visited.has(normalizeUrl(l.href)));

            if(unread.length > 0) {
                const target = unread[0];
                const cleanTargetUrl = normalizeUrl(target.href);
                
                UI.log(`发现新帖，准备进入...`);
                // **关键修复**：先保存记录，再跳转
                Storage.save(cleanTargetUrl);
                
                setTimeout(() => {
                    window.location.href = target.href;
                }, 500); // 留 0.5秒 给浏览器写缓存
                return;
            }

            // 没找到就往下滚
            state.searchAttempts++;
            if(state.searchAttempts < CONFIG.maxSearchScroll) {
                UI.log(`向下翻找中 (${state.searchAttempts})...`);
                window.scrollTo(0, document.body.scrollHeight);
                setTimeout(() => this.scanList(), 2000);
            } else {
                UI.log("到底了，刷新一下看看");
                setTimeout(() => location.reload(), 5000);
            }
        },

        readPost: function() {
            UI.log("📖 正在努力爬楼...");
            let lastHeight = document.documentElement.scrollHeight;
            let lastScrollTime = Date.now();

            const timer = setInterval(() => {
                if(!state.isRunning) { clearInterval(timer); return; }

                window.scrollBy(0, CONFIG.scrollStep);

                const footer = document.querySelector('#suggested-topics') || document.querySelector('#topic-footer-buttons');
                const isAtBottom = footer && (footer.getBoundingClientRect().top <= window.innerHeight + 100);

                const currentHeight = document.documentElement.scrollHeight;
                if(currentHeight > lastHeight) {
                    lastHeight = currentHeight;
                    lastScrollTime = Date.now();
                }

                // 退出逻辑
                if (isAtBottom) {
                    clearInterval(timer);
                    UI.log("✅ 已读完，准备返回列表");
                    setTimeout(() => { window.location.href = CONFIG.homeUrl; }, CONFIG.bottomStay);
                } else if ((Date.now() - lastScrollTime) > (CONFIG.maxWaitTime * 1000)) {
                    clearInterval(timer);
                    UI.log("⚠️ 加载太慢，跳过此帖");
                    setTimeout(() => { window.location.href = CONFIG.homeUrl; }, 1000);
                }
            }, CONFIG.scrollInterval);
        }
    };

    window.addEventListener('load', () => {
        UI.init();
        if(state.isRunning) {
            setTimeout(() => Core.start(), 2000);
        }
    });
})();
