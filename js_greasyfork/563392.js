// ==UserScript==
// @name         おんJ スレ主IDチェッカー
// @namespace    http://tampermonkey.net/
// @version      3.7
// @author       WaiON
// @description  おんJでスレ主のIDをチェックし、NGIDが立てたスレは警告/非表示する。
// @match        https://hayabusa.open2ch.net/livejupiter/*
// @match        https://hayabusa.open2ch.net/test/read.cgi/livejupiter/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563392/%E3%81%8A%E3%82%93J%20%E3%82%B9%E3%83%AC%E4%B8%BBID%E3%83%81%E3%82%A7%E3%83%83%E3%82%AB%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/563392/%E3%81%8A%E3%82%93J%20%E3%82%B9%E3%83%AC%E4%B8%BBID%E3%83%81%E3%82%A7%E3%83%83%E3%82%AB%E3%83%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //iOS26.1(Safari)で検証済み
  
    // ==================== 設定エリア ====================
    const CONFIG = {
        CHECK_LIMIT: 10,           // 自動取得する上位スレッド数
        WAIT_MIN: 800,             // 取得間隔 下限 (ms)
        WAIT_MAX: 1600,            // 取得間隔 上限 (ms)
        CACHE_EXPIRY_HOURS: 4,     // キャッシュ有効期限 (時間)
        ID_LIST_KEY: 'ignv4livejupiter',
        CACHE_KEY: 'ignv_cache',
        HIDE_NG: false,            // 警告/NGのスレッドを消す場合は true

        // 各表示ページでの動作設定 (true で有効 / false で無効)
        TARGET_VIEWS: {
            '': true,             // デフォルト(リンクの最後に#がつかない場合)
            '#ikioi': true,       // 勢い順
            '#created': true,     // 新スレ
            '#ninzu': false,       // 人数順
            '#updated': false,     // 新レス順
            '#live': false,        // 配信
            '#history': false      // 履歴
        }
    };
    // ====================================================

    const COLORS = { 
        LOADING: '#FFEB3B',
        WARNING: '#F44336',
        SAFE: '#4CAF50',
        ERROR: '#000000'
    };

    const CACHE_EXPIRY_MS = CONFIG.CACHE_EXPIRY_HOURS * 60 * 60 * 1000;
    let fetchedCount = 0;
    let isProcessing = false;
    let queue = [];
    let observer = null;

    // 現在のハッシュ値が設定で有効になっているか確認
    const isTargetPage = () => {
        const hash = window.location.hash;
        return !!CONFIG.TARGET_VIEWS[hash];
    };

    const isThreadReadPage = () => window.location.pathname.includes('/test/read.cgi/livejupiter/');

    const getBlackList = () => {
        const raw = localStorage.getItem(CONFIG.ID_LIST_KEY) || "";
        return raw.split('<D>').map(id => id.trim()).filter(id => id.length > 0);
    };

    const getCache = () => JSON.parse(localStorage.getItem(CONFIG.CACHE_KEY) || "{}");
    
    const setCache = (url, ownerId) => {
        const cache = getCache();
        cache[url] = { ownerId, date: Date.now() };
        localStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify(cache));
    };

    const cleanOldCache = () => {
        const cache = getCache();
        const now = Date.now();
        let changed = false;
        for (const url in cache) {
            if (now - cache[url].date > CACHE_EXPIRY_MS) {
                delete cache[url];
                changed = true;
            }
        }
        if (changed) localStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify(cache));
    };

    const normalizeUrl = (url) => {
        const match = url.match(/\/test\/read\.cgi\/livejupiter\/\d+/);
        return match ? match[0] : url;
    };

    const applyJudgment = (threadElem, lineElem, isNG, isError = false) => {
        if (!threadElem || !lineElem) return;
        if (isError) {
            lineElem.style.backgroundColor = COLORS.ERROR;
            return;
        }
        if (isNG) {
            if (CONFIG.HIDE_NG) {
                threadElem.style.display = 'none';
            } else {
                lineElem.style.backgroundColor = COLORS.WARNING;
            }
        } else {
            lineElem.style.backgroundColor = COLORS.SAFE;
            threadElem.style.display = ''; 
        }
    };

    async function processQueue() {
        if (isProcessing || queue.length === 0) return;
        isProcessing = true;

        try {
            const blackList = getBlackList();
            while (queue.length > 0) {
                // 処理中にページが対象外（無効なハッシュ）に変わったら中止
                if (!isTargetPage() || document.visibilityState === 'hidden') break;

                const task = queue.shift();
                const normalized = normalizeUrl(task.threadUrl);
                
                const cache = getCache();
                if (cache[normalized]) {
                    applyJudgment(task.threadElem, task.lineElem, blackList.includes(cache[normalized].ownerId));
                    continue;
                }

                if (fetchedCount >= CONFIG.CHECK_LIMIT) {
                    task.lineElem.remove();
                    continue;
                }

                try {
                    fetchedCount++;
                    const res = await fetch(normalized + "/-1");
                    const html = await res.text();
                    const idMatch = html.match(/class="_id"[^>]+val="([^"]+)"/) || html.match(/val="([^"]+)"[^>]+class="_id"/);
                    const ownerId = idMatch ? idMatch[1] : null;

                    if (ownerId) {
                        setCache(normalized, ownerId);
                        applyJudgment(task.threadElem, task.lineElem, blackList.includes(ownerId));
                    }
                } catch (e) {
                    applyJudgment(task.threadElem, task.lineElem, false, true);
                }

                if (queue.length > 0) {
                    const waitTime = Math.floor(Math.random() * (CONFIG.WAIT_MAX - CONFIG.WAIT_MIN + 1)) + CONFIG.WAIT_MIN;
                    await new Promise(r => setTimeout(r, waitTime));
                }
            }
        } finally {
            isProcessing = false;
        }
    }

    function initUI() {
        if (!isTargetPage()) {
            document.querySelectorAll('.id-checker-line').forEach(el => el.remove());
            queue = [];
            return;
        }

        const threads = Array.from(document.querySelectorAll('.thread'));
        const cache = getCache();
        const blackList = getBlackList();
        let addedToQueue = false;

        threads.forEach((thread, index) => {
            if (thread.querySelector('.id-checker-line')) return;
            const link = thread.querySelector('a');
            if (!link) return;

            const url = link.href;
            const normalized = normalizeUrl(url);
            const cachedData = cache[normalized];

            thread.style.position = 'relative';
            const line = document.createElement('div');
            line.className = 'id-checker-line';
            line.style.cssText = `position: absolute; top: 2px; bottom: 2px; right: 0; width: 6px; border-radius: 2px; z-index: 10; pointer-events: none;`;
            thread.appendChild(line);

            if (cachedData) {
                applyJudgment(thread, line, blackList.includes(cachedData.ownerId));
            } else if (index < CONFIG.CHECK_LIMIT) {
                line.style.backgroundColor = COLORS.LOADING;
                queue.push({ threadUrl: url, lineElem: line, threadElem: thread });
                addedToQueue = true;
            }
        });

        if (addedToQueue && !isProcessing) processQueue();
    }

    const resetAndStart = () => {
        isProcessing = false;
        queue = [];
        fetchedCount = 0;
        
        document.querySelectorAll('.id-checker-line').forEach(el => el.remove());
        
        if (isThreadReadPage()) {
            const idSpan = document.querySelector('li[val="1"] ._id, dl[val="1"] ._id');
            if (idSpan) setCache(normalizeUrl(window.location.href), idSpan.getAttribute('val'));
            return;
        }

        if (!isTargetPage()) return;

        cleanOldCache();
        if (observer) observer.disconnect();
        
        const container = document.querySelector('#current_thread_list') || document.querySelector('#thread_list') || document.body;
        observer = new MutationObserver(() => initUI());
        observer.observe(container, { childList: true, subtree: true });
        
        initUI();
    };

    window.addEventListener('hashchange', resetAndStart);
    window.addEventListener('popstate', resetAndStart);
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') processQueue();
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resetAndStart);
    } else {
        resetAndStart();
    }
})();
