// ==UserScript==
// @name         Komica 統計助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  統計ID發言次數並提供過濾功能，協助過濾免洗帳號
// @author       Komica User
// @match        https://*.komica1.org/*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/561965/Komica%20%E7%B5%B1%E8%A8%88%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/561965/Komica%20%E7%B5%B1%E8%A8%88%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'komica_stats_record_v2';
    const CONFIG_KEY = 'komica_stats_config_v1';
    const CACHE_DURATION = 86400000;
    const API_URL = "https://komica-backup.onrender.com/api/stats/batch_query";
    const API_HEADER_KEY = "X-K-Token";
    const API_HEADER_VAL = "komicatnw";

    let idMap = new Map();
    let syncTimer = null;
    let observerTimer = null;
    let blockedIdsSet = new Set();
    let syncStatus = 'init';
    let config = { threshold: 0 };

    const loadConfig = () => {
        try {
            const saved = JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}');
            config = { ...config, ...saved };
        } catch (e) {}
    };

    const saveConfig = () => {
        localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
        processPage();
        updateUiState();
    };

    const loadLocalData = () => {
        try {
            const jsonString = localStorage.getItem(STORAGE_KEY);
            if (!jsonString) return;
            const data = JSON.parse(jsonString);
            const now = Date.now();
            const records = data.records || {};
            idMap.clear();
            for (const [id, info] of Object.entries(records)) {
                if (now - info.t < CACHE_DURATION) {
                    idMap.set(id, info.c);
                }
            }
        } catch (e) {}
    };

    const syncData = async (force = false) => {
        let localData = {};
        try {
            localData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"records":{}, "lastSync":0}');
        } catch (e) {}

        const records = localData.records || {};
        const lastSync = localData.lastSync || 0;
        const nextPollWait = (localData.nextPoll || 300) * 1000;
        const now = Date.now();

        if (!force && (now - lastSync < nextPollWait)) {
            refreshIdMapFromRecords(records);
            syncStatus = 'ok';
            processPage();
            updateInfoUi();
            scheduleSync(nextPollWait - (now - lastSync));
            return;
        }

        try {
            syncStatus = 'syncing';
            updateInfoUi();

            const res = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    [API_HEADER_KEY]: API_HEADER_VAL
                }
            });

            if (!res.ok) throw new Error();
            const json = await res.json();
            const newStats = json.stats || {};
            const nextPoll = json.next_poll || 300;

            for (const [id, count] of Object.entries(newStats)) {
                records[id] = {
                    c: count,
                    t: now
                };
            }

            for (const id in records) {
                if (now - records[id].t > CACHE_DURATION) {
                    delete records[id];
                }
            }

            const dataToSave = {
                lastSync: now,
                nextPoll: nextPoll,
                records: records
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));

            refreshIdMapFromRecords(records);
            syncStatus = 'ok';
            processPage();
            scheduleSync(nextPoll * 1000);

        } catch (e) {
            syncStatus = 'error';
            refreshIdMapFromRecords(records);
            processPage();
            scheduleSync(60000);
        }
        updateInfoUi();
    };

    const refreshIdMapFromRecords = (records) => {
        idMap.clear();
        const now = Date.now();
        for (const [id, info] of Object.entries(records)) {
            if (now - info.t < CACHE_DURATION) {
                idMap.set(id, info.c);
            }
        }
    };

    const scheduleSync = (ms) => {
        if (syncTimer) clearTimeout(syncTimer);
        syncTimer = setTimeout(() => syncData(false), Math.max(1000, ms));
    };

    const processPage = () => {
        const limit = parseInt(config.threshold) || 0;
        blockedIdsSet.clear();
        let hiddenCount = 0;

        const isSystemReady = idMap.size > 0;

        const threads = document.querySelectorAll('.thread');

        threads.forEach(thread => {
            let hideThread = false;
            const posts = thread.querySelectorAll('.post, .reply');

            posts.forEach((post, index) => {
                const idEl = post.querySelector('.id') || post.querySelector('.post-head .id');
                if (idEl) {
                    let rawId = idEl.getAttribute('data-id');
                    if (!rawId) {
                        const txt = idEl.innerText || "";
                        if (txt.includes("ID:")) rawId = txt.split("ID:")[1].trim().split(" ")[0];
                        else rawId = txt.trim();
                    }

                    if (rawId && rawId.length >= 2) {
                        let count = 0;
                        let tagTxt = "";

                        if (isSystemReady) {
                            count = idMap.get(rawId) || 1;
                            tagTxt = `[發言: ${count}]`;
                        } else {
                            tagTxt = `[發言: N/A]`;
                        }

                        let next = idEl.nextElementSibling;
                        const isTag = (next && next.className === 'k-stat-tag');
                        if (isTag) {
                            if (next.textContent !== tagTxt) {
                                next.textContent = tagTxt;
                                next.style.color = isSystemReady ? '#ff5733' : '#999';
                            }
                        } else {
                            let span = document.createElement('span');
                            span.className = 'k-stat-tag';
                            span.style.cssText = `margin-left:5px; font-size:0.9em; color: ${isSystemReady ? '#ff5733' : '#999'};`;
                            span.textContent = tagTxt;
                            idEl.insertAdjacentElement('afterend', span);
                        }

                        if (isSystemReady && count < limit) {
                            if (index === 0) {
                                hideThread = true;
                            } else {
                                post.style.display = 'none';
                            }
                            blockedIdsSet.add(rawId);
                            hiddenCount++;
                        } else {
                            if (post.style.display === 'none') {
                                post.style.display = '';
                            }
                        }
                    }
                }
            });

            if (hideThread) {
                thread.style.display = 'none';
            } else {
                if (thread.style.display === 'none') {
                    thread.style.display = '';
                }
            }
        });

        updateLogUi();
    };

    const initObserver = () => {
        const obs = new MutationObserver((mutations) => {
            let act = false;
            for (const m of mutations) {
                if (m.addedNodes.length > 0) act = true;
                if (m.type === 'attributes' && m.attributeName === 'style') act = true;
            }
            if (act) {
                if (observerTimer) clearTimeout(observerTimer);
                observerTimer = setTimeout(() => processPage(), 100);
            }
        });
        const target = document.querySelector('#threads') || document.body;
        if(target) obs.observe(target, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
    };

    const buildUi = () => {
        const top = document.querySelector('#toplink');
        if (!top) { setTimeout(buildUi, 500); return; }
        if (document.getElementById('k-stat-btn')) return;

        const span = document.createElement('span');
        span.id = 'k-stat-btn';
        span.innerHTML = ` [<a class="text-button" style="cursor:pointer;">統計設定</a>]`;
        top.appendChild(span);

        const panel = document.createElement('div');
        panel.style.cssText = "position:fixed; right:10px; top:50px; width:260px; background:rgba(30,30,30,0.95); color:#eee; font-size:13px; z-index:9999; padding:15px; border-radius:6px; display:none; box-shadow:0 4px 15px rgba(0,0,0,0.6); font-family:sans-serif;";

        panel.innerHTML = `
            <div style="font-weight:bold; color:#fff; border-bottom:1px solid #555; padding-bottom:8px; margin-bottom:12px;">
                Komica 統計助手
                <span id="kp-close" style="float:right; cursor:pointer; color:#999;">✕</span>
            </div>
            <div style="margin-bottom:15px;">
                <div style="color:#f90; margin-bottom:6px; font-weight:bold;">過濾設定</div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span>發言數低於此值隱藏:</span>
                    <input type="number" id="kp-thresh" style="width:50px; text-align:center; padding:2px;" min="0">
                </div>
                <div style="font-size:11px; color:#aaa; margin-top:4px;">(設定為 2 即隱藏僅有 1 次發言的 ID)</div>
            </div>
            <button id="kp-save" style="cursor:pointer; width:100%; padding:6px; background:#28a745; color:#fff; border:none; border-radius:4px; margin-bottom:15px;">保存並套用</button>
            <hr style="border-color:#444; margin:0 0 10px 0;">
            <div style="margin-bottom:10px;">
                <div style="color:#ff6666; margin-bottom:5px; font-size:12px;">本次隱藏 ID 數: <span id="kp-count">0</span></div>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:11px; color:#888;">
                <div id="kp-info">準備中...</div>
                <a href="#" id="kp-sync" style="color:#09f; text-decoration:none;">強制更新</a>
            </div>
        `;
        document.body.appendChild(panel);

        span.querySelector('a').onclick = () => {
            updateUiState();
            updateInfoUi();
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        };
        panel.querySelector('#kp-close').onclick = () => panel.style.display = 'none';
        panel.querySelector('#kp-save').onclick = () => {
            config.threshold = parseInt(document.getElementById('kp-thresh').value) || 0;
            saveConfig();
        };
        panel.querySelector('#kp-sync').onclick = (e) => {
            e.preventDefault();
            syncData(true);
        };
    };

    const updateUiState = () => {
        const el = document.getElementById('kp-thresh');
        if(el) el.value = config.threshold;
    };

    const updateLogUi = () => {
        const el = document.getElementById('kp-count');
        if(el) el.textContent = blockedIdsSet.size;
    };

    const updateInfoUi = () => {
        const el = document.getElementById('kp-info');
        if (!el) return;

        if (idMap.size === 0) {
             if (syncStatus === 'syncing') {
                 el.innerHTML = '初始化中...';
             } else {
                 el.innerHTML = '<span style="color:#ffcc00;">無資料 (過濾已停用)。若持續發生，請聯絡作者。</span>';
             }
             return;
        }

        if (syncStatus === 'syncing') {
            el.innerHTML = '更新中...';
            return;
        }
        if (syncStatus === 'error') {
            el.innerHTML = '<span style="color:#ffcc00;">更新失敗 (使用暫存)</span>';
            return;
        }
        try {
            const local = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            if (local.lastSync) {
                const t = new Date(local.lastSync + (local.nextPoll || 300) * 1000).toLocaleTimeString();
                el.innerHTML = `下次同步: ${t}`;
            } else {
                el.innerHTML = '等待同步...';
            }
        } catch(e) {}
    };

    const main = () => {
        loadConfig();
        loadLocalData();
        processPage();

        window.addEventListener('DOMContentLoaded', () => {
            buildUi();
            initObserver();
            processPage();
        });
        window.addEventListener('load', () => processPage());

        syncData(false);

        window.addEventListener('storage', (e) => {
            if (e.key === STORAGE_KEY) {
                const d = JSON.parse(e.newValue || '{}');
                if (d.records) {
                    refreshIdMapFromRecords(d.records);
                    processPage();
                    updateInfoUi();
                }
            }
        });

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') syncData(false);
        });
    };

    main();
})();