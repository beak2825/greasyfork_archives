// ==UserScript==
// @name         B站直播分区筛选助手 (V4.0 极速暴力版)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  [2026-01-17] 极速版：1. 开启6线程并发请求，筛选速度起飞；2. 暴力自动向下滚动，到底即停。
// @author       Gemini
// @match        https://live.bilibili.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @connect      api.live.bilibili.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/562909/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%88%86%E5%8C%BA%E7%AD%9B%E9%80%89%E5%8A%A9%E6%89%8B%20%28V40%20%E6%9E%81%E9%80%9F%E6%9A%B4%E5%8A%9B%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/562909/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%88%86%E5%8C%BA%E7%AD%9B%E9%80%89%E5%8A%A9%E6%89%8B%20%28V40%20%E6%9E%81%E9%80%9F%E6%9A%B4%E5%8A%9B%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log('[Bili Filter] V4.0 (Turbo) Starting...');

    // --- 1. 配置 ---
    const DEFAULT_SETTINGS = {
        minViewers: 1, maxViewers: 0,
        minFollowers: 0, maxFollowers: 0,
        minGuards: 0, maxGuards: 0,
        autoScroll: false
    };

    let settings = {};
    for (let key in DEFAULT_SETTINGS) {
        settings[key] = GM_getValue(key, DEFAULT_SETTINGS[key]);
    }

    // --- 核心变量 ---
    // 并发数：建议 5-8，太高(比如20)容易被B站瞬间封锁接口导致数据全空
    const MAX_CONCURRENT = 6;
    let activeRequests = 0; // 当前正在运行的请求数
    let requestQueue = [];  // 待处理队列

    // 滚动变量
    let scrollInterval = null;
    let lastHeight = 0;
    let sameHeightCount = 0;

    // --- 2. 设置面板 ---
    function createSettingsPanel() {
        if (document.getElementById('bili-filter-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'bili-filter-panel';
        panel.innerHTML = `
            <div class="panel-header">
                直播筛选 (极速版) <span class="version">v4.0</span>
                <span id="queue-status" class="queue-status">空闲</span>
            </div>
            <div class="panel-body">
                <div class="control-row">
                    <label class="switch-label">⚡ 暴力滚动 (到底自停):</label>
                    <label class="switch">
                        <input type="checkbox" id="autoScrollToggle" ${settings.autoScroll ? 'checked' : ''}>
                        <span class="slider round"></span>
                    </label>
                </div>
                <hr class="divider">
                <div class="form-group"><label>👀真实观众 (在线):</label><div class="input-group"><input type="number" id="minViewers" value="${settings.minViewers}"><span class="sep">-</span><input type="number" id="maxViewers" placeholder="不限" value="${settings.maxViewers || ''}"></div></div>
                <div class="form-group"><label>💖粉丝数:</label><div class="input-group"><input type="number" id="minFollowers" value="${settings.minFollowers}"><span class="sep">-</span><input type="number" id="maxFollowers" placeholder="不限" value="${settings.maxFollowers || ''}"></div></div>
                <div class="form-group"><label>⚓舰长数:</label><div class="input-group"><input type="number" id="minGuards" value="${settings.minGuards}"><span class="sep">-</span><input type="number" id="maxGuards" placeholder="不限" value="${settings.maxGuards || ''}"></div></div>
                <button id="save-settings-btn">保存并刷新</button>
            </div>
            <div class="panel-toggle">🚀</div>
        `;
        document.body.appendChild(panel);

        document.getElementById('save-settings-btn').addEventListener('click', saveAndApply);
        document.getElementById('autoScrollToggle').addEventListener('change', (e) => {
            settings.autoScroll = e.target.checked;
            GM_setValue('autoScroll', settings.autoScroll);
            if(settings.autoScroll) startAutoScroll();
            else stopAutoScroll();
        });
        document.querySelector('.panel-toggle').addEventListener('click', () => panel.classList.toggle('collapsed'));

        if(settings.autoScroll) startAutoScroll();
    }

    function saveAndApply() {
        ['minViewers', 'maxViewers', 'minFollowers', 'maxFollowers', 'minGuards', 'maxGuards'].forEach(id => {
            settings[id] = parseInt(document.getElementById(id).value) || 0;
            GM_setValue(id, settings[id]);
        });
        resetAndScan();
    }

    function resetAndScan() {
        requestQueue = [];
        activeRequests = 0;
        document.querySelectorAll('.index_item_JSGkw').forEach(card => {
            card.removeAttribute('data-checked');
            card.removeAttribute('data-queued');
            card.style.display = '';
            card.style.opacity = '1';
            const old = card.querySelector('.streamer-stats-display');
            if(old) old.remove();
        });
        updateStatus();
        processCards();
    }

    function updateStatus() {
        const el = document.getElementById('queue-status');
        if(!el) return;
        if (requestQueue.length > 0 || activeRequests > 0) {
            el.innerText = `处理中... (剩余:${requestQueue.length})`;
            el.style.color = '#ff6699';
        } else {
            el.innerText = '完成';
            el.style.color = '#4caf50';
        }
    }

    // --- 3. 极速滚动逻辑 ---
    function startAutoScroll() {
        if (scrollInterval) clearInterval(scrollInterval);
        console.log('[Bili Filter] Turbo Scroll ON');
        lastHeight = document.body.scrollHeight;
        sameHeightCount = 0;

        scrollInterval = setInterval(() => {
            window.scrollTo(0, document.body.scrollHeight);

            // 检查高度变化
            const currentHeight = document.body.scrollHeight;
            if (currentHeight === lastHeight) {
                sameHeightCount++;
                // 连续2次检测高度没变（2秒），判定为到底，直接停
                if (sameHeightCount >= 2) {
                    console.log('到底了，停止滚动');
                    stopAutoScroll();
                    // 自动把开关关掉
                    settings.autoScroll = false;
                    GM_setValue('autoScroll', false);
                    document.getElementById('autoScrollToggle').checked = false;
                    // 给个小提示
                    const toast = document.createElement('div');
                    toast.innerText = '⚡ 已滚动到底部';
                    toast.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.8);color:#fff;padding:10px 20px;border-radius:20px;z-index:99999;';
                    document.body.appendChild(toast);
                    setTimeout(() => toast.remove(), 2000);
                }
            } else {
                sameHeightCount = 0; // 高度变了，重置计数
                lastHeight = currentHeight;
            }
        }, 0); // 1.2秒滚一次，给B站留一点点加载DOM的时间
    }

    function stopAutoScroll() {
        if (scrollInterval) clearInterval(scrollInterval);
        scrollInterval = null;
    }

    // --- 4. 并发队列系统 (Turbo Mode) ---
    function processQueue() {
        // 如果正在处理的少于最大并发数，且队列里还有任务
        while (activeRequests < MAX_CONCURRENT && requestQueue.length > 0) {
            const item = requestQueue.shift();

            // 元素可能在滚动中被销毁，检查一下
            if (document.body.contains(item.card)) {
                activeRequests++;
                fetchFullData(item.roomId, item.card, () => {
                    activeRequests--;
                    updateStatus();
                    processQueue(); // 递归调用，完成一个立马补下一个
                });
            }
        }
        updateStatus();
    }

    // --- 5. 数据获取 ---
    function fetchFullData(roomId, card, onComplete) {
        card.setAttribute('data-checked', 'processing');
        card.style.opacity = '0.7';

        // 获取信息
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByRoom?room_id=${roomId}`,
            onload: function (r1) {
                let d1;
                try { d1 = JSON.parse(r1.responseText); } catch(e){}

                if (!d1 || d1.code !== 0) {
                    finish(0,0,0); return;
                }

                const uid = d1.data.room_info.uid;
                const followers = d1.data.anchor_info.relation_info.attention;
                const guards = d1.data.guard_info.count;

                // 获取真实人数
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://api.live.bilibili.com/xlive/general-interface/v1/rank/getOnlineGoldRank?roomId=${roomId}&ruid=${uid}&page=1&pageSize=1`,
                    onload: function (r2) {
                        let viewers = 0;
                        try { viewers = JSON.parse(r2.responseText).data?.onlineNum || 0; } catch (e) {}
                        finish(viewers, followers, guards);
                    },
                    onerror: () => finish(0, followers, guards)
                });
            },
            onerror: () => finish(0,0,0)
        });

        function finish(viewers, followers, guards) {
            updateCard(card, viewers, followers, guards);
            onComplete();
        }
    }

    function updateCard(card, viewers, followers, guards) {
        card.style.opacity = '1';
        card.setAttribute('data-checked', 'true');

        const maxView = settings.maxViewers || Infinity;
        const maxFol = settings.maxFollowers || Infinity;
        const maxGua = settings.maxGuards || Infinity;

        const isMatch = (
            viewers >= settings.minViewers && viewers <= maxView &&
            followers >= settings.minFollowers && followers <= maxFol &&
            guards >= settings.minGuards && guards <= maxGua
        );

        if (isMatch) {
            card.style.display = '';
            // 检查是否已经存在statsDiv (防止重复添加)
            let statsDiv = card.querySelector('.streamer-stats-display');
            if (!statsDiv) {
                statsDiv = document.createElement('div');
                statsDiv.className = 'streamer-stats-display';
                const container = card.querySelector('.Item_right__RSaW') || card;
                container.appendChild(statsDiv);
            }

            const fmt = (n) => n >= 10000 ? (n/10000).toFixed(1)+'万' : n;
            statsDiv.innerHTML = `
                <div style="color:#ff6699;font-weight:bold">👀 ${viewers}</div>
                <div style="font-size:11px;color:#888">💖${fmt(followers)} ⚓${guards}</div>
            `;
        } else {
            card.style.display = 'none';
        }
    }

    function processCards() {
        const cards = document.querySelectorAll('.index_item_JSGkw:not([data-queued])');
        if (cards.length === 0) return;

        cards.forEach(card => {
            const link = card.querySelector('a');
            const ridMatch = link?.href?.match(/live\.bilibili\.com\/(\d+)/);
            if (ridMatch) {
                card.setAttribute('data-queued', 'true');
                requestQueue.push({ roomId: ridMatch[1], card: card });
            } else {
                card.setAttribute('data-checked', 'skip');
            }
        });

        processQueue(); // 触发队列
    }

    // --- 样式注入 ---
    GM_addStyle(`
        #bili-filter-panel { position: fixed; top: 120px; right: 0; width: 220px; background: #fff; border-left: 4px solid #ff6699; border-radius: 8px 0 0 8px; box-shadow: -2px 2px 10px rgba(0,0,0,0.2); z-index: 99999; transition: transform 0.2s; font-family: sans-serif; }
        #bili-filter-panel.collapsed { transform: translateX(100%); }
        .panel-header { padding: 10px; font-weight: bold; background: #fff0f6; color: #d63384; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #fadce9; }
        .queue-status { font-size: 11px; font-weight: normal; }
        .panel-body { padding: 10px; }
        .control-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .switch-label { font-weight: bold; color: #333; font-size: 13px; }
        .form-group { margin-bottom: 6px; }
        .form-group label { display: block; font-size: 11px; color: #666; }
        .input-group { display: flex; }
        .input-group input { width: 100%; padding: 4px; border: 1px solid #ddd; text-align: center; font-size: 12px; }
        .input-group .sep { padding: 0 4px; color: #ccc; }
        #save-settings-btn { width: 100%; padding: 6px; background: #ff6699; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; margin-top: 5px; }
        #save-settings-btn:hover { background: #ff3377; }
        .panel-toggle { position: absolute; top: 0; left: -30px; width: 30px; height: 40px; background: #ff6699; color: #fff; border-radius: 5px 0 0 5px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .switch { position: relative; display: inline-block; width: 34px; height: 18px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .2s; border-radius: 18px; }
        .slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 2px; bottom: 2px; background-color: white; transition: .2s; border-radius: 50%; }
        input:checked + .slider { background-color: #ff6699; }
        input:checked + .slider:before { transform: translateX(16px); }
        .streamer-stats-display { margin-top: 4px; padding: 4px; background: #fff; border: 1px solid #ffd1e1; border-radius: 4px; font-size: 12px; line-height: 1.4; text-align: center; }
    `);

    // --- 启动 ---
    createSettingsPanel();
    const observer = new MutationObserver(() => processCards());
    const initTimer = setInterval(() => {
        const target = document.querySelector('.index_item_JSGkw') || document.getElementById('room-card-list');
        if (target) {
            clearInterval(initTimer);
            processCards();
            // 监听父级容器
            observer.observe(target.parentElement || document.body, { childList: true, subtree: true });
        }
    }, 800);

})();