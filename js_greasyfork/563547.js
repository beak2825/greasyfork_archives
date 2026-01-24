// ==UserScript==
// @name         Linux.do 考古掘金 (V4.4 低配强力驱动版)
// @namespace    http://tampermonkey.net/
// @version      4.4
// @description  专治低配VPS卡在列表页不动。加入视觉调试、暴力加载逻辑。
// @author       Gemini_User
// @match        https://linux.do/*
// @match        https://www.linux.do/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563547/Linuxdo%20%E8%80%83%E5%8F%A4%E6%8E%98%E9%87%91%20%28V44%20%E4%BD%8E%E9%85%8D%E5%BC%BA%E5%8A%9B%E9%A9%B1%E5%8A%A8%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563547/Linuxdo%20%E8%80%83%E5%8F%A4%E6%8E%98%E9%87%91%20%28V44%20%E4%BD%8E%E9%85%8D%E5%BC%BA%E5%8A%9B%E9%A9%B1%E5%8A%A8%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- ⚙️ 极低配专用配置 ---
    const CONFIG = {
        homeUrl: "https://linux.do/latest",
        scrollStep: 300,             
        scrollDelay: 2000,           // 列表页滚动间隔加长到 2秒
        maxWaitSeconds: 180,
        maxListScroll: 50,
        storageKey: 'linuxdo_history_v4_3', 
        statusKey: 'linuxdo_running_v4'
    };

    // --- 🛠️ 辅助函数 ---
    const normalizeUrl = (url) => {
        try {
            const u = new URL(url);
            return u.origin + u.pathname.replace(/\/(\d+)?$/, '');
        } catch (e) { return url; }
    };

    // --- 💾 存储管理 ---
    const DB = {
        cache: new Set(),
        isDirty: false,
        init: function() {
            try {
                const raw = localStorage.getItem(CONFIG.storageKey);
                if (raw) {
                    const data = JSON.parse(raw);
                    const now = Date.now();
                    for (const u in data) {
                        if (now - data[u] < 604800000) this.cache.add(u);
                    }
                }
            } catch (e) {}
            window.addEventListener('beforeunload', () => this.flush());
            setInterval(() => this.flush(), 30000);
        },
        add: function(url) {
            const clean = normalizeUrl(url);
            if (!this.cache.has(clean)) {
                this.cache.add(clean);
                this.isDirty = true;
            }
        },
        has: function(url) {
            return this.cache.has(normalizeUrl(url));
        },
        flush: function() {
            if (!this.isDirty) return;
            try {
                if (this.cache.size > 5000) { // 限制缓存大小
                    const arr = Array.from(this.cache).slice(-5000);
                    this.cache = new Set(arr);
                }
                const data = {};
                this.cache.forEach(u => { data[u] = Date.now(); });
                localStorage.setItem(CONFIG.storageKey, JSON.stringify(data));
                this.isDirty = false;
                console.log('💾 [DB] Saved');
            } catch(e) {}
        }
    };

    // --- 🗑️ 垃圾回收 ---
    const GC = {
        timers: [],
        observers: [],
        regTimeout: function(fn, delay) {
            const id = setTimeout(fn, delay);
            this.timers.push(id);
            return id;
        },
        regObserver: function(cb, opts) {
            const obs = new IntersectionObserver(cb, opts);
            this.observers.push(obs);
            return obs;
        },
        killAll: function() {
            this.timers.forEach(clearTimeout);
            this.timers = [];
            this.observers.forEach(o => o.disconnect());
            this.observers = [];
        }
    };

    // --- 🖥️ 增强型 UI 面板 ---
    const UI = {
        el: null,
        status: null,
        debug: null,
        init: function() {
            if (document.getElementById('ld-panel')) return;
            const div = document.createElement('div');
            div.id = 'ld-panel';
            div.style.cssText = 'position:fixed; bottom:10px; right:10px; z-index:9999; background:rgba(0,0,0,0.85); color:#0f0; padding:10px; border-radius:6px; font-size:12px; font-family:monospace; border:1px solid #444; min-width:150px;';
            div.innerHTML = `
                <div style="font-weight:bold; border-bottom:1px solid #555; margin-bottom:5px; padding-bottom:3px;">🐧 V4.4 强力版</div>
                <div id="ld-status">⏳ 初始化...</div>
                <div id="ld-debug" style="color:#aaa; font-size:10px; margin-top:5px;">等待数据...</div>
                <button id="ld-btn" style="margin-top:8px; width:100%; cursor:pointer; font-size:10px;">⏯️ 启停</button>
            `;
            document.body.appendChild(div);

            this.status = document.getElementById('ld-status');
            this.debug = document.getElementById('ld-debug');
            
            document.getElementById('ld-btn').onclick = () => {
                const s = localStorage.getItem(CONFIG.statusKey) === '1';
                localStorage.setItem(CONFIG.statusKey, s ? '0' : '1');
                location.reload();
            };
        },
        log: function(msg) { if (this.status) this.status.innerText = msg; },
        info: function(msg) { if (this.debug) this.debug.innerText = msg; }
    };

    // --- 🚀 核心逻辑 ---
    const App = {
        init: function() {
            const isRunning = localStorage.getItem(CONFIG.statusKey) === '1';
            UI.init();
            DB.init();

            if (!isRunning) {
                UI.log("⏸️ 已暂停");
                return;
            }

            const path = location.pathname;
            
            // 路由分发
            if (/\/t\/.*?\/\d+/.test(path)) {
                this.runPostLogic();
            } else if (path === '/' || path.includes('/latest') || path.includes('/top') || path.includes('/c/') || path.includes('/unread')) {
                // 确保在列表页加载完元素再跑
                this.waitForList();
            } else {
                UI.log("🔄 归位 Latest...");
                setTimeout(() => location.href = CONFIG.homeUrl, 1000);
            }
        },

        // 🛡️ 等待列表元素加载 (关键修复)
        waitForList: function() {
            UI.log("⏳ 等待列表加载...");
            let attempts = 0;
            const check = () => {
                const list = document.querySelector('.topic-list'); // Discourse 列表核心容器
                const items = document.querySelectorAll('.topic-list-item');
                
                if (list && items.length > 0) {
                    UI.log("✅ 列表已就绪");
                    this.runListLogic();
                } else {
                    attempts++;
                    UI.info(`DOM探测中... (${attempts})`);
                    if (attempts > 20) {
                         UI.log("⚠️ 列表加载失败，刷新");
                         setTimeout(() => location.reload(), 2000);
                    } else {
                         GC.regTimeout(check, 500);
                    }
                }
            };
            check();
        },

        // 🟢 列表页逻辑 (增强版)
        runListLogic: function() {
            UI.log("🔍 扫描引擎启动...");
            let scrollCount = 0;
            let stuckCount = 0;
            let lastHeight = 0;

            const scan = () => {
                // 1. 获取所有链接
                const links = Array.from(document.querySelectorAll('.topic-list-item .raw-topic-link'));
                
                // 2. 统计未读
                const unreadLinks = links.filter(l => !DB.has(l.href));
                
                // 3. 更新面板数据 (重要！看这里就知道有没有卡)
                UI.info(`全:${links.length} | 新:${unreadLinks.length} | 滚:${scrollCount}`);

                // 4. 有新货？直接进！
                if (unreadLinks.length > 0) {
                    const target = unreadLinks[0];
                    UI.log(`🚀 捕获: ${target.innerText.slice(0, 8)}...`);
                    DB.add(target.href);
                    DB.flush();
                    location.href = target.href;
                    return;
                }

                // 5. 没新货？准备滚动
                const currentHeight = document.body.scrollHeight;
                
                if (currentHeight === lastHeight) {
                    stuckCount++;
                    UI.log(`🚧 触底/卡顿 (${stuckCount})`);
                    
                    // --- 暴力激活逻辑 ---
                    if (stuckCount >= 2) {
                        UI.log("🔨 暴力回弹加载...");
                        // 先往上滚一点，再往下滚，强制触发 Discourse 监听器
                        window.scrollBy(0, -200);
                        setTimeout(() => window.scrollTo({ top: document.body.scrollHeight + 500, behavior: 'instant' }), 300);
                    }
                    
                    if (stuckCount > 6) { // 12秒都没刷出来
                        UI.log("⚠️ 彻底卡死，刷新重置");
                        setTimeout(() => location.reload(), 2000);
                        return;
                    }
                } else {
                    stuckCount = 0; // 高度变了，说明加载成功
                    scrollCount++;
                }

                lastHeight = currentHeight;
                
                // 6. 执行常规滚动
                if (scrollCount > CONFIG.maxListScroll) {
                    UI.log("🛑 轮次结束，刷新");
                    setTimeout(() => location.reload(), 2000);
                    return;
                }

                if (stuckCount === 0) {
                    UI.log("📉 下钻中...");
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
                }

                GC.regTimeout(scan, CONFIG.scrollDelay);
            };

            scan();
        },

        // 🔵 帖子页逻辑 (保持 V4.3 的稳定版)
        runPostLogic: function() {
            UI.log("📖 正在爬楼...");
            let stuckCount = 0;
            let lastY = -1;

            const observer = GC.regObserver((entries) => {
                if (entries[0].isIntersecting) {
                    UI.log(`✅ 读完！`);
                    GC.killAll();
                    setTimeout(() => location.href = CONFIG.homeUrl, 2000);
                }
            }, { rootMargin: '300px' });

            // 持续寻找底部
            const findFooter = () => {
                const els = document.querySelectorAll('#suggested-topics, #topic-footer-buttons, .topic-footer-main-buttons');
                els.forEach(el => observer.observe(el));
            };
            setInterval(findFooter, 2000);

            const loop = () => {
                window.scrollBy({ top: 250, behavior: 'instant' }); // 稍微加大步长
                
                if (Math.abs(window.scrollY - lastY) < 5) {
                    stuckCount++;
                    UI.log(`⏳ 加载中... ${stuckCount}`);
                    if (stuckCount % 3 === 0) window.scrollBy(0, -150); // Wiggle
                    if (stuckCount > 30) location.href = CONFIG.homeUrl; // 超时跳过
                } else {
                    stuckCount = 0;
                }
                lastY = window.scrollY;
                GC.regTimeout(loop, 1500);
            };
            loop();
        }
    };

    // --- 启动 ---
    // 使用 requestAnimationFrame 确保在渲染帧空闲时启动
    window.addEventListener('load', () => {
        setTimeout(() => App.init(), 3000); // 3秒冷启动，给VPS足够的渲染时间
    });

})();