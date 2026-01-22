// ==UserScript==
// @name         Linux.do 考古掘金 (V4.3 修复版)
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  全自动爬楼 + 低配VPS优化 + 错误自动修复。移除所有报错权限，即插即用。
// @author       Gemini_User
// @match        https://linux.do/*
// @match        https://www.linux.do/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563547/Linuxdo%20%E8%80%83%E5%8F%A4%E6%8E%98%E9%87%91%20%28V43%20%E4%BF%AE%E5%A4%8D%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563547/Linuxdo%20%E8%80%83%E5%8F%A4%E6%8E%98%E9%87%91%20%28V43%20%E4%BF%AE%E5%A4%8D%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- ⚙️ 配置区域 ---
    const CONFIG = {
        homeUrl: "https://linux.do/latest",
        scrollStep: 200,             // 每次滚动的像素
        scrollDelay: 1500,           // 滚动间隔 (1.5秒，防卡顿)
        bottomStay: 2000,            // 到底后停留时间
        maxWaitSeconds: 180,         // 超时上限
        maxListScroll: 30,           // 列表页最大翻页数
        storageKey: 'linuxdo_history_v4_3', // 升级数据库Key防止冲突
        statusKey: 'linuxdo_running_v4'
    };

    // --- 🛠️ 辅助工具 ---
    const normalizeUrl = (url) => {
        try {
            const u = new URL(url);
            // 移除路径末尾的 /1, /123 等楼层号，只保留帖子ID
            const cleanPath = u.pathname.replace(/\/(\d+)?$/, '');
            return u.origin + cleanPath;
        } catch (e) {
            return url;
        }
    };

    // --- 💾 存储管理 (内存缓存版) ---
    const DB = {
        cache: new Set(),
        isDirty: false,

        init: function() {
            try {
                const raw = localStorage.getItem(CONFIG.storageKey);
                if (raw) {
                    const data = JSON.parse(raw);
                    const now = Date.now();
                    // 加载7天内的历史记录
                    for (const u in data) {
                        if (now - data[u] < 604800000) {
                            this.cache.add(u);
                        }
                    }
                }
            } catch (e) {
                console.error("Storage Error:", e);
            }

            // 页面关闭前保存
            window.addEventListener('beforeunload', () => this.flush());
            // 定时自动保存
            setInterval(() => this.flush(), 60000);
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
                if (this.cache.size > 5000) {
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

    // --- 🗑️ 资源回收 (防止定时器泄露) ---
    const GC = {
        timers: [],
        observers: [],

        regInterval: function(fn, delay) {
            const id = setInterval(fn, delay);
            this.timers.push({type: 'interval', id: id});
            return id;
        },
        
        regTimeout: function(fn, delay) {
            const id = setTimeout(fn, delay);
            this.timers.push({type: 'timeout', id: id});
            return id;
        },

        regObserver: function(cb, opts) {
            const obs = new IntersectionObserver(cb, opts);
            this.observers.push(obs);
            return obs;
        },

        killAll: function() {
            this.timers.forEach(t => {
                if(t.type === 'interval') clearInterval(t.id);
                if(t.type === 'timeout') clearTimeout(t.id);
            });
            this.timers = [];
            this.observers.forEach(o => o.disconnect());
            this.observers = [];
            console.log('🧹 [GC] Cleaned');
        }
    };

    // --- 🖥️ 界面显示 ---
    const UI = {
        el: null,
        init: function() {
            if (document.getElementById('ld-panel')) return;
            const div = document.createElement('div');
            div.id = 'ld-panel';
            div.style.cssText = 'position:fixed; bottom:10px; right:10px; z-index:9999; background:rgba(0,0,0,0.8); color:#0f0; padding:8px; border-radius:4px; font-size:12px; font-family:monospace; border:1px solid #333; cursor:pointer;';
            div.innerHTML = '<div id="ld-log">🐧 V4.3 待机</div>';
            document.body.appendChild(div);

            div.onclick = () => {
                const s = localStorage.getItem(CONFIG.statusKey) === '1';
                localStorage.setItem(CONFIG.statusKey, s ? '0' : '1');
                location.reload();
            };
            this.el = document.getElementById('ld-log');
        },
        log: function(msg) {
            if (this.el) this.el.innerText = msg;
        }
    };

    // --- 🚀 主逻辑 ---
    const App = {
        init: function() {
            const isRunning = localStorage.getItem(CONFIG.statusKey) === '1';
            UI.init();
            DB.init();

            if (!isRunning) {
                UI.log("⏸️ 已暂停 (点我运行)");
                return;
            }

            const path = location.pathname;
            // 路由判断
            if (/\/t\/.*?\/\d+/.test(path)) {
                this.runPostLogic();
            } else if (path === '/' || path.includes('/latest') || path.includes('/top') || path.includes('/c/')) {
                this.runListLogic();
            } else {
                UI.log("🔄 返回主页...");
                setTimeout(() => location.href = CONFIG.homeUrl, 1000);
            }
        },

        // 🟢 列表页扫描
        runListLogic: function() {
            UI.log("🔍 扫描列表中...");
            let scrollCount = 0;

            const scan = () => {
                const links = document.querySelectorAll('.topic-list-item .raw-topic-link');
                for (let i = 0; i < links.length; i++) {
                    const link = links[i];
                    if (!DB.has(link.href)) {
                        UI.log(`🚀 进入: ${link.innerText.slice(0, 8)}...`);
                        DB.add(link.href);
                        DB.flush();
                        location.href = link.href;
                        return;
                    }
                }

                scrollCount++;
                if (scrollCount > CONFIG.maxListScroll) {
                    UI.log("⚠️ 列表到底，刷新重置");
                    setTimeout(() => location.reload(), 3000);
                    return;
                }

                UI.log(`📉 下滑寻找 [${scrollCount}]`);
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
                GC.regTimeout(scan, 2000);
            };

            GC.regTimeout(scan, 1500);
        },

        // 🔵 帖子页爬楼 (低配增强版)
        runPostLogic: function() {
            UI.log("📖 阅读中...");
            
            let lastScrollY = -1;
            let stuckCount = 0;
            let totalHeight = 0;

            // 1. 到底检测 (Observer)
            const observer = GC.regObserver((entries) => {
                if (entries[0].isIntersecting) {
                    UI.log(`✅ 完成！停留${CONFIG.bottomStay/1000}s`);
                    GC.killAll();
                    setTimeout(() => location.href = CONFIG.homeUrl, CONFIG.bottomStay);
                }
            }, { rootMargin: '400px' });

            const bindFooter = () => {
                const targets = document.querySelectorAll('#suggested-topics, #topic-footer-buttons, .topic-footer-main-buttons');
                targets.forEach(el => observer.observe(el));
            };
            GC.regInterval(bindFooter, 2000);

            // 2. 滚动循环
            const loop = () => {
                const currentY = window.scrollY;
                const docHeight = document.body.scrollHeight;

                window.scrollBy({ top: CONFIG.scrollStep, behavior: 'instant' });

                // 卡顿检测
                if (Math.abs(currentY - lastScrollY) < 5) {
                    stuckCount++;
                    UI.log(`⏳ 加载等待... ${stuckCount}`);

                    // 回弹激活 (Wiggle)
                    if (stuckCount % 3 === 0) {
                        UI.log("🔧 尝试回弹修复");
                        window.scrollBy({ top: -150, behavior: 'instant' });
                    }

                    if (docHeight > totalHeight) {
                        stuckCount = 0;
                        totalHeight = docHeight;
                    }

                    if (stuckCount * (CONFIG.scrollDelay/1000) > CONFIG.maxWaitSeconds) {
                        UI.log("⚠️ 超时跳过");
                        location.href = CONFIG.homeUrl;
                        return;
                    }
                } else {
                    stuckCount = 0;
                    totalHeight = docHeight;
                }
                lastScrollY = window.scrollY;
            };

            GC.regInterval(loop, CONFIG.scrollDelay);
        }
    };

    // --- 启动 ---
    window.addEventListener('load', () => setTimeout(() => App.init(), 1000));
    // 处理浏览器后退按钮
    window.addEventListener('popstate', () => location.reload());

})();