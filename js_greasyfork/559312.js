// ==UserScript==
// @name         Fab.com Free Asset Auto-Claim Assistant
// @name:zh-CN   Fab.com 免费资产自动领取助手
// @name:en      Fab.com Free Asset Auto-Claim Assistant
// @name:ja      Fab.com 無料資産自動請求アシスタント
// @namespace    https://github.com/black-zero358
// @version      3.7
// @description  Automatically scans Fab.com for free assets and claims them in bulk, featuring a visual UI, error logging, and API hijacking capabilities.
// @description:zh-CN 自动扫描 Fab.com 免费资产并批量领取，带有可视化UI、错误记录和API劫持功能。
// @description:ja 視覚的な UI、エラー ログ、API ハイジャック機能を備え、Fab.com で無料アセットを自動的にスキャンして一括請求します。
// @author       blackzero358 & Gemini
// @match        https://www.fab.com/*
// @icon         https://s2.loli.net/2025/12/18/EJol8ZrViqzfQ7M.png
// @license      AGPLv3
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559312/Fabcom%20Free%20Asset%20Auto-Claim%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/559312/Fabcom%20Free%20Asset%20Auto-Claim%20Assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========================= 配置 / Config =========================
    const CONFIG = {
        MAX_ADDS: 1000,
        SCROLL_WAIT_MS: 300,
        REQUEST_DELAY: 500,
        ADD_DELAY: 221,
        BATCH_SIZE: 24,
        SCROLL_STEP: 800,
        MAX_JIGGLES: 10,
        JIGGLE_HEIGHT: 400,
        JIGGLE_WAIT: 1000,
        FORCE_LANG: null // Initial detection, can be changed in UI
    };

    // ========================= i18n 字典 =========================
    const I18N = {
        'zh-CN': {
            lang_name: '中文',
            title: 'Fab 助手',
            status_ready: '就绪',
            status_running: '运行中...',
            status_stopping: '正在停止...',
            status_stopped: '已停止',
            btn_start: '开始运行',
            btn_stop: '停止',
            lbl_scanned: '已发现',
            lbl_success: '本次入库',
            lbl_owned: '已拥有',
            lbl_failed: '失败',
            tab_logs: '运行日志',
            tab_errors: '失败记录',
            log_start: '🚀 脚本已启动',
            log_stop: '🛑 脚本已完全停止',
            log_wait_stop: '⏳ 正在等待当前任务结束...',
            log_scan: '📡 网络嗅探: 捕获 {0} 个新ID',
            log_batch_check: '🔍 检查状态: {0} 个资产',
            log_batch_all_owned: '⏭️ 本批次全部已拥有',
            log_skip_no_free: '⚠️ 跳过(无免费): {0}',
            log_success: '✅ 成功入库: {0}...',
            log_fail: '❌ 入库失败: {0}...',
            log_batch_error: '💥 批次检查错误: {0}',
            log_scroll: '⬇️ 滚动加载中...',
            log_bottom_jiggle: '⚓ 触底: 执行抖动加载 ({0}/{1})...',
            log_bottom_end: '🏁 已到达底部且无新数据',
            log_limit_reach: '🎉 已达上限，任务结束',
            log_error_generic: '❌ 运行异常: {0}'
        },
        'en': {
            lang_name: 'English',
            title: 'Fab Helper',
            status_ready: 'Ready',
            status_running: 'Running...',
            status_stopping: 'Stopping...',
            status_stopped: 'Stopped',
            btn_start: 'Start',
            btn_stop: 'Stop',
            lbl_scanned: 'Found',
            lbl_success: 'Claimed',
            lbl_owned: 'Owned',
            lbl_failed: 'Failed',
            tab_logs: 'Logs',
            tab_errors: 'Errors',
            log_start: '🚀 Script Started',
            log_stop: '🛑 Script Stopped',
            log_wait_stop: '⏳ Waiting for tasks to finish...',
            log_scan: '📡 Sniffer: Captured {0} new IDs',
            log_batch_check: '🔍 Checking: {0} assets',
            log_batch_all_owned: '⏭️ Batch already owned',
            log_skip_no_free: '⚠️ Skip (Not Free): {0}',
            log_success: '✅ Claimed: {0}...',
            log_fail: '❌ Failed: {0}...',
            log_batch_error: '💥 Batch Error: {0}',
            log_scroll: '⬇️ Scrolling...',
            log_bottom_jiggle: '⚓ Bottom hit: Jiggling ({0}/{1})...',
            log_bottom_end: '🏁 Reached bottom, no new data',
            log_limit_reach: '🎉 Limit reached, finished',
            log_error_generic: '❌ Exception: {0}'
        },
        'ja': {
            lang_name: '日本語',
            title: 'Fab ヘルパー',
            status_ready: '準備完了',
            status_running: '実行中...',
            status_stopping: '停止中...',
            status_stopped: '停止しました',
            btn_start: '開始',
            btn_stop: '停止',
            lbl_scanned: '発見',
            lbl_success: '入手成功',
            lbl_owned: '所持済み',
            lbl_failed: '失敗',
            tab_logs: 'ログ',
            tab_errors: 'エラー',
            log_start: '🚀 スクリプトを開始しました',
            log_stop: '🛑 スクリプトを停止しました',
            log_wait_stop: '⏳ タスクの終了を待機中...',
            log_scan: '📡 スニファ: 新規ID {0}個 を取得',
            log_batch_check: '🔍 状態確認: {0} 個',
            log_batch_all_owned: '⏭️ 全て所持済みのためスキップ',
            log_skip_no_free: '⚠️ スキップ (有料): {0}',
            log_success: '✅ 入手成功: {0}...',
            log_fail: '❌ 入手失敗: {0}...',
            log_batch_error: '💥 バッチエラー: {0}',
            log_scroll: '⬇️ スクロール中...',
            log_bottom_jiggle: '⚓ 最下部: 再読み込み試行 ({0}/{1})...',
            log_bottom_end: '🏁 最下部に到達、新規データなし',
            log_limit_reach: '🎉 上限に達しました',
            log_error_generic: '❌ 実行時エラー: {0}'
        }
    };

    // ========================= i18n 工具函数 =========================
    function getInitialLang() {
        if (CONFIG.FORCE_LANG) return CONFIG.FORCE_LANG;
        const navLang = navigator.language || navigator.userLanguage;
        if (navLang.startsWith('zh')) return 'zh-CN';
        if (navLang.startsWith('ja')) return 'ja';
        return 'en'; // Default fallback
    }

    let CURRENT_LANG = getInitialLang();

    function t(key, ...args) {
        let str = I18N[CURRENT_LANG][key] || I18N['en'][key] || key;
        args.forEach((arg, index) => {
            str = str.replace(`{${index}}`, arg);
        });
        return str;
    }

    // ========================= 状态管理 =========================
    const state = {
        isRunning: false,
        stopSignal: false,
        lastStatusKey: 'status_ready', // 记录当前状态key以便切换语言
        stats: { scanned: 0, owned: 0, success: 0, failed: 0 },
        globalIdQueue: new Set(),
        processedIds: new Set(),
        failedIds: new Set()
    };

    // ========================= UI 构建 =========================
    const UI_ID = 'fab-auto-claim-panel';
    const css = `
        #${UI_ID} {
            position: fixed; bottom: 20px; right: 20px; width: 380px;
            background: #1e1e1e; color: #e0e0e0; border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5); font-family: 'Segoe UI', sans-serif;
            z-index: 9999; border: 1px solid #333; display: flex;
            flex-direction: column; overflow: hidden; transition: opacity 0.3s;
        }
        #${UI_ID} .fab-header {
            padding: 12px 16px; background: #252525; border-bottom: 1px solid #333;
            display: flex; justify-content: space-between; align-items: center;
            cursor: move; user-select: none;
        }
        #${UI_ID} .fab-title-group { display: flex; align-items: center; gap: 8px; }
        #${UI_ID} .fab-title { font-weight: bold; font-size: 14px; color: #fff; pointer-events: none; }
        #${UI_ID} .fab-lang-btn {
            font-size: 10px; background: #333; border: 1px solid #444; color: #aaa;
            padding: 1px 6px; border-radius: 4px; cursor: pointer; transition: all 0.2s;
        }
        #${UI_ID} .fab-lang-btn:hover { background: #444; color: #fff; border-color: #666; }

        #${UI_ID} .fab-status { font-size: 12px; color: #888; pointer-events: none; }

        #${UI_ID} .fab-controls { padding: 12px; display: flex; gap: 10px; }
        #${UI_ID} .fab-btn { flex: 1; padding: 8px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; transition: all 0.2s; }
        #${UI_ID} .btn-start { background: #2e7d32; color: white; }
        #${UI_ID} .btn-start:hover { background: #388e3c; }
        #${UI_ID} .btn-start:disabled { background: #1b381d; color: #555; cursor: not-allowed; }
        #${UI_ID} .btn-stop { background: #c62828; color: white; }
        #${UI_ID} .btn-stop:hover { background: #d32f2f; }

        #${UI_ID} .fab-stats-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 8px; padding: 0 12px 12px 12px; text-align: center; }
        #${UI_ID} .stat-item { background: #2a2a2a; padding: 6px; border-radius: 6px; }
        #${UI_ID} .stat-val { font-size: 16px; font-weight: bold; display: block; }
        #${UI_ID} .stat-label { font-size: 10px; color: #aaa; }
        .c-blue { color: #42a5f5; } .c-green { color: #66bb6a; } .c-gray { color: #bdbdbd; } .c-red { color: #ef5350; }

        #${UI_ID} .fab-tabs { display: flex; border-bottom: 1px solid #333; }
        #${UI_ID} .fab-tab { flex: 1; padding: 8px; text-align: center; background: #252525; cursor: pointer; font-size: 12px; color: #888; }
        #${UI_ID} .fab-tab.active { background: #1e1e1e; color: #fff; border-top: 2px solid #42a5f5; }

        #${UI_ID} .fab-content-area { height: 250px; position: relative; }
        #${UI_ID} .fab-scroll-view { height: 100%; overflow-y: auto; padding: 10px; font-family: 'Consolas', monospace; font-size: 11px; line-height: 1.4; }
        #${UI_ID} .log-entry { margin-bottom: 4px; border-bottom: 1px solid #2a2a2a; padding-bottom: 2px; }
        #${UI_ID} .log-time { color: #666; margin-right: 5px; }

        #${UI_ID} ::-webkit-scrollbar { width: 6px; }
        #${UI_ID} ::-webkit-scrollbar-thumb { background: #444; border-radius: 3px; }
        #${UI_ID} ::-webkit-scrollbar-track { background: #1e1e1e; }
    `;

    if (typeof GM_addStyle !== 'undefined') GM_addStyle(css);
    else { const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s); }

    function createUI() {
        const div = document.createElement('div');
        div.id = UI_ID;
        // 注意：这里为所有需要翻译的文本节点添加了 ID
        div.innerHTML = `
            <div class="fab-header" id="fab-header-drag">
                <div class="fab-title-group">
                    <span class="fab-title" id="ui-title">${t('title')}</span>
                    <button id="fab-lang-switch" class="fab-lang-btn">🌐 ${t('lang_name')}</button>
                </div>
                <span class="fab-status" id="fab-status-text">${t('status_ready')}</span>
            </div>
            <div class="fab-controls">
                <button class="fab-btn btn-start" id="fab-btn-start">${t('btn_start')}</button>
                <button class="fab-btn btn-stop" id="fab-btn-stop" disabled>${t('btn_stop')}</button>
            </div>
            <div class="fab-stats-grid">
                <div class="stat-item"><span class="stat-val c-blue" id="stat-scanned">0</span><span class="stat-label" id="lbl-scanned">${t('lbl_scanned')}</span></div>
                <div class="stat-item"><span class="stat-val c-green" id="stat-success">0</span><span class="stat-label" id="lbl-success">${t('lbl_success')}</span></div>
                <div class="stat-item"><span class="stat-val c-gray" id="stat-owned">0</span><span class="stat-label" id="lbl-owned">${t('lbl_owned')}</span></div>
                <div class="stat-item"><span class="stat-val c-red" id="stat-failed">0</span><span class="stat-label" id="lbl-failed">${t('lbl_failed')}</span></div>
            </div>
            <div class="fab-tabs">
                <div class="fab-tab active" data-tab="logs"><span id="tab-logs-txt">${t('tab_logs')}</span></div>
                <div class="fab-tab" data-tab="errors"><span id="tab-errors-txt">${t('tab_errors')}</span> (<span id="err-count">0</span>)</div>
            </div>
            <div class="fab-content-area">
                <div id="view-logs" class="fab-scroll-view"></div>
                <div id="view-errors" class="fab-scroll-view" style="display:none;"></div>
            </div>
        `;
        document.body.appendChild(div);

        document.getElementById('fab-btn-start').onclick = startScript;
        document.getElementById('fab-btn-stop').onclick = requestStop;
        document.getElementById('fab-lang-switch').onclick = switchLanguage; // 绑定语言切换事件

        const tabs = div.querySelectorAll('.fab-tab');
        tabs.forEach(tab => {
            tab.onclick = () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                div.querySelector('#view-logs').style.display = tab.dataset.tab === 'logs' ? 'block' : 'none';
                div.querySelector('#view-errors').style.display = tab.dataset.tab === 'errors' ? 'block' : 'none';
            };
        });

        // 拖拽逻辑
        const header = document.getElementById('fab-header-drag');
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        header.onmousedown = function(e) {
            // 防止点击按钮时触发拖拽
            if (e.target.id === 'fab-lang-switch') return;

            e.preventDefault();
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = div.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
            div.style.bottom = 'auto';
            div.style.right = 'auto';
            div.style.left = initialLeft + 'px';
            div.style.top = initialTop + 'px';
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };
        function onMouseMove(e) {
            if (!isDragging) return;
            div.style.left = (initialLeft + (e.clientX - startX)) + 'px';
            div.style.top = (initialTop + (e.clientY - startY)) + 'px';
        }
        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }

    // ========================= 语言切换逻辑 =========================
    function switchLanguage() {
        if (CURRENT_LANG === 'zh-CN') CURRENT_LANG = 'en';
        else if (CURRENT_LANG === 'en') CURRENT_LANG = 'ja';
        else CURRENT_LANG = 'zh-CN';

        refreshUIText();
    }

    function refreshUIText() {
        const el = (id) => document.getElementById(id);
        if(!el('ui-title')) return; // UI not ready

        el('ui-title').textContent = t('title');
        el('fab-lang-switch').textContent = `🌐 ${t('lang_name')}`;
        el('fab-status-text').textContent = t(state.lastStatusKey);
        el('fab-btn-start').textContent = t('btn_start');
        el('fab-btn-stop').textContent = t('btn_stop');

        el('lbl-scanned').textContent = t('lbl_scanned');
        el('lbl-success').textContent = t('lbl_success');
        el('lbl-owned').textContent = t('lbl_owned');
        el('lbl-failed').textContent = t('lbl_failed');

        el('tab-logs-txt').textContent = t('tab_logs');
        el('tab-errors-txt').textContent = t('tab_errors');
    }

    // ========================= UI 工具 =========================
    function updateStats() {
        document.getElementById('stat-scanned').textContent = state.globalIdQueue.size;
        document.getElementById('stat-success').textContent = state.stats.success;
        document.getElementById('stat-owned').textContent = state.stats.owned;
        document.getElementById('stat-failed').textContent = state.stats.failed;
        document.getElementById('err-count').textContent = state.stats.failed;
    }

    function addLog(msg, color = '#ccc') {
        const view = document.getElementById('view-logs');
        if (!view) return;
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        const time = new Date().toLocaleTimeString(CURRENT_LANG === 'zh-CN' ? 'zh-CN' : 'en-US', { hour12: false });
        entry.innerHTML = `<span class="log-time">[${time}]</span><span style="color:${color}">${msg}</span>`;
        view.appendChild(entry);
        view.scrollTop = view.scrollHeight;
    }

    function addErrorLog(id, errorMsg) {
        const view = document.getElementById('view-errors');
        if (!view) return;
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.style.color = '#ef5350';
        const time = new Date().toLocaleTimeString(CURRENT_LANG === 'zh-CN' ? 'zh-CN' : 'en-US', { hour12: false });
        entry.innerHTML = `<div><span class="log-time">[${time}]</span>ID: ${id}</div><div style="font-size:10px; opacity:0.8; padding-left:10px;">${errorMsg}</div>`;
        view.appendChild(entry);
        addLog(t('log_fail', id.substring(0,6)), '#ef5350');
    }

    function setStatus(textKey, isRunning) {
        state.lastStatusKey = textKey; // 保存当前状态 Key
        document.getElementById('fab-status-text').textContent = t(textKey);

        if (textKey === 'status_stopping') {
            document.getElementById('fab-btn-start').disabled = true;
            document.getElementById('fab-btn-stop').disabled = true;
        } else {
            document.getElementById('fab-btn-start').disabled = isRunning;
            document.getElementById('fab-btn-stop').disabled = !isRunning;
        }
    }

    // ========================= API & Fetch 劫持 =========================
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        const [resource, config] = args;
        const response = await originalFetch(resource, config);
        try {
            const url = resource.toString();
            if (url.includes('/listings/search') || url.includes('algo_search')) {
                const clone = response.clone();
                clone.json().then(data => {
                    if (data && data.results && Array.isArray(data.results)) {
                        let newCount = 0;
                        data.results.forEach(item => {
                            if (item.uid && !state.globalIdQueue.has(item.uid)) {
                                state.globalIdQueue.add(item.uid);
                                newCount++;
                            }
                        });
                        if (newCount > 0) {
                            state.stats.scanned += newCount;
                            updateStats();
                            addLog(t('log_scan', newCount), '#ab47bc');
                        }
                    }
                }).catch(() => {});
            }
        } catch (e) {}
        return response;
    };

    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const getCsrf = () => (document.cookie.match(/fab_csrftoken=([^;]+)/) || [])[1];

    const apiCall = async (url, opts={}) => {
        const token = getCsrf();
        if(!token) throw new Error("无 CSRF Token");
        const res = await originalFetch(url, {
            ...opts, headers: { ...opts.headers, 'x-csrftoken': token, 'x-requested-with': 'XMLHttpRequest', 'referer': window.location.href }
        });
        if(res.status === 204) return {success:true};
        if(!res.ok) {
            const txt = await res.text();
            throw new Error(`Status ${res.status}: ${txt.substring(0,50)}`);
        }
        const txt = await res.text();
        return txt ? JSON.parse(txt) : {};
    };

    // ========================= 核心流程 =========================
    const processBatch = async (ids) => {
        addLog(t('log_batch_check', ids.length));
        try {
            const params = [...new Set(ids)].map(id=>`listing_ids=${id}`).join('&');
            const states = await apiCall(`https://www.fab.com/i/users/me/listings-states?${params}`);

            const toAdd = [];
            states.forEach(s => {
                if(s.acquired) { state.processedIds.add(s.uid); state.stats.owned++; }
                else toAdd.push(s.uid);
            });
            updateStats();

            if(!toAdd.length) {
                addLog(t('log_batch_all_owned'), '#757575');
                return;
            }

            for(const id of toAdd) {
                if(state.stopSignal) return;
                try {
                    const info = await apiCall(`https://www.fab.com/i/listings/${id}/prices-infos`);
                    const offer = info.offers?.find(o => o.price === 0 || o.discountedPrice === 0);

                    if(!offer) {
                        addLog(t('log_skip_no_free', id.substring(0,6)), '#ff9800');
                    } else {
                        const boundary = 'B' + Math.random().toString(36).slice(2);
                        await apiCall(`https://www.fab.com/i/listings/${id}/add-to-library`, {
                            method: 'POST',
                            headers: {'content-type': `multipart/form-data; boundary=----${boundary}`},
                            body: `------${boundary}\r\nContent-Disposition: form-data; name="offer_id"\r\n\r\n${offer.offerId}\r\n------${boundary}--\r\n`
                        });
                        state.stats.success++;
                        addLog(t('log_success', id.substring(0,8)), '#66bb6a');
                    }
                } catch(e) {
                    state.stats.failed++;
                    state.failedIds.add(id);
                    addErrorLog(id, e.message);
                }
                state.processedIds.add(id);
                updateStats();
                await sleep(CONFIG.ADD_DELAY);
            }
        } catch(e) {
            addErrorLog('BATCH_ERROR', e.message);
            addLog(t('log_batch_error', e.message), '#e53935');
            ids.forEach(id => state.failedIds.add(id));
        }
    };

    const scanDom = () => {
        const links = document.querySelectorAll('a[href*="/listings/"]');
        let n = 0;
        links.forEach(a => {
            const m = a.getAttribute('href').match(/\/listings\/([a-f0-9-]{36})/i);
            if(m && !state.globalIdQueue.has(m[1])) {
                state.globalIdQueue.add(m[1]);
                n++;
            }
        });
        if(n>0) { state.stats.scanned += n; updateStats(); }
    };

    // ========================= 控制逻辑 =========================

    async function startScript() {
        if(state.isRunning || state.stopSignal) return;

        state.isRunning = true;
        state.stopSignal = false;
        setStatus('status_running', true);
        addLog(t('log_start'));

        scanDom();

        let jiggleCount = 0;
        let noDataScrollCount = 0;

        try {
            while(!state.stopSignal && state.stats.success < CONFIG.MAX_ADDS) {
                const pending = Array.from(state.globalIdQueue).filter(id =>
                    !state.processedIds.has(id) && !state.failedIds.has(id)
                );

                if(pending.length > 0) {
                    jiggleCount = 0;
                    noDataScrollCount = 0;
                    await processBatch(pending.slice(0, CONFIG.BATCH_SIZE));
                    await sleep(CONFIG.REQUEST_DELAY);
                } else {
                    const beforeScroll = Math.ceil(window.scrollY);

                    window.scrollBy({ top: CONFIG.SCROLL_STEP, behavior: 'smooth' });
                    await sleep(CONFIG.SCROLL_WAIT_MS);
                    scanDom();

                    const afterScroll = Math.ceil(window.scrollY);

                    if (Math.abs(afterScroll - beforeScroll) < 10) {
                        if (jiggleCount < CONFIG.MAX_JIGGLES) {
                            jiggleCount++;
                            addLog(t('log_bottom_jiggle', jiggleCount, CONFIG.MAX_JIGGLES), '#ffb74d');
                            window.scrollBy({ top: -CONFIG.JIGGLE_HEIGHT, behavior: 'instant' });
                            await sleep(200);
                            window.scrollBy({ top: CONFIG.JIGGLE_HEIGHT + 150, behavior: 'smooth' });
                            await sleep(CONFIG.JIGGLE_WAIT);
                            scanDom();
                        } else {
                            addLog(t('log_bottom_end'), '#f44336');
                            break;
                        }
                    } else {
                        jiggleCount = 0;
                        noDataScrollCount++;
                        if(noDataScrollCount % 5 === 0) addLog(t('log_scroll'), '#90caf9');
                    }
                }
            }
        } catch (e) {
            addLog(t('log_error_generic', e.message), '#e53935');
        } finally {
            state.isRunning = false;
            state.stopSignal = false;
            setStatus('status_stopped', false);
            if (state.stats.success >= CONFIG.MAX_ADDS) {
                addLog(t('log_limit_reach'), '#66bb6a');
            } else {
                addLog(t('log_stop'));
            }
        }
    }

    function requestStop() {
        if (!state.isRunning) return;
        state.stopSignal = true;
        setStatus('status_stopping', true);
        addLog(t('log_wait_stop'), '#ffb74d');
    }

    setTimeout(createUI, 1000);
})();