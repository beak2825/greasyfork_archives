// ==UserScript==
// @name         あいもげカタログ新着レス数表示
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  カタログの既読スレに、前回訪問時からの新着レス数を表示します
// @author       Feldschlacht
// @license      MIT
// @match        https://nijiurachan.net/pc/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560761/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E3%82%AB%E3%82%BF%E3%83%AD%E3%82%B0%E6%96%B0%E7%9D%80%E3%83%AC%E3%82%B9%E6%95%B0%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/560761/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E3%82%AB%E3%82%BF%E3%83%AD%E3%82%B0%E6%96%B0%E7%9D%80%E3%83%AC%E3%82%B9%E6%95%B0%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 設定 ---
    const STORAGE_KEY = 'aimoge_thread_history';
    const EXPIRE_DAYS = 7;

    // --- CSSスタイルの注入 ---
    function addGlobalStyle() {
        const css = `
            /* --- 新着レス数のテキストスタイル --- */
            .res-diff-added {
                color: red;
                font-weight: bold;
                margin-left: 0px;
                font-size: 100%;
            }
            body.dark-mode .res-diff-added {
                color: #ff4080;
            }

            /* --- 新着ありスレッドの強調表示 (枠線のみ) --- */
            /* 背景色は変更せず、既存スクリプトに任せる */

            /* ライトモード */
            #cattable td.cat-cell.res-diff-has-new {
                box-shadow: inset 0 0 0 1px #ff0000 !important;
                transition: box-shadow 0.3s ease, background-color 0.3s ease;
            }

            /* ダークモード */
            body.dark-mode #cattable td.cat-cell.res-diff-has-new {
                box-shadow: inset 0 0 0 1px #ff4080 !important;
                transition: box-shadow 0.3s ease, background-color 0.3s ease;
            }

            /* --- 過去ログ落ちスレッドの表示 (見歴・履歴モード用) --- */
            /* !important を使って既読色や新着枠よりも優先して「終了感」を出す */

            /* ライトモード: 背景グレー */
            #cattable td.cat-cell.is-past-log {
                background-color: #e0e0e0 !important;
                border-color: #bbb !important;
            }

            /* ダークモード: 背景ダークグレー */
            body.dark-mode #cattable td.cat-cell.is-past-log {
                background-color: #222222 !important;
                color: #888 !important;
                border-color: #444 !important;
            }
        `;
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }
    addGlobalStyle();

    // --- ユーティリティ ---
    function loadHistory() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        } catch (e) { return {}; }
    }

    function saveHistory(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function cleanOldData() {
        const history = loadHistory();
        const now = Date.now();
        const expireTime = EXPIRE_DAYS * 24 * 60 * 60 * 1000;
        let changed = false;
        Object.keys(history).forEach(id => {
            if (now - history[id].lastSeen > expireTime) {
                delete history[id];
                changed = true;
            }
        });
        if (changed) saveHistory(history);
    }

    // --- ページ判定 ---
    const path = window.location.pathname;
    const search = window.location.search;

    if (path.includes('thread.php')) {
        handleThreadPage();
    } else if (path.includes('catalog.php')) {
        handleCatalogPage();

        // 見歴(mode=viewed) または 履歴(mode=posted) の場合のみ過去ログ判定を実行
        if (search.includes('mode=viewed') || search.includes('mode=posted')) {
            handleHistoryMode();
        }
    }

    // --- スレッド画面の処理 ---
    function handleThreadPage() {
        let threadId = null;
        if (window.__THREAD_CONFIG__ && window.__THREAD_CONFIG__.threadId) {
            threadId = String(window.__THREAD_CONFIG__.threadId);
        } else {
            const match = location.search.match(/[?&]id=(\d+)/);
            if (match) threadId = match[1];
        }
        if (!threadId) return;

        const updateResCount = () => {
            const rscElements = document.querySelectorAll('.rsc');
            if (rscElements.length === 0) return;

            let maxResNum = 0;
            rscElements.forEach(el => {
                const num = parseInt(el.textContent.trim(), 10);
                if (!isNaN(num) && num > maxResNum) {
                    maxResNum = num;
                }
            });

            if (maxResNum > 0) {
                const history = loadHistory();
                history[threadId] = {
                    resCount: maxResNum,
                    lastSeen: Date.now()
                };
                saveHistory(history);
            }
        };

        updateResCount();
        cleanOldData();

        const observer = new MutationObserver((mutations) => {
            if (mutations.some(m => m.addedNodes.length > 0)) updateResCount();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        window.addEventListener('beforeunload', updateResCount);
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') updateResCount();
        });
    }

    // --- カタログ画面の処理 (新着表示) ---
    function handleCatalogPage() {
        const table = document.getElementById('cattable');
        if (!table) return;

        const applyDiffDisplay = () => {
            const history = loadHistory();
            const cells = table.querySelectorAll('.cat-cell');

            cells.forEach(cell => {
                const threadId = cell.dataset.threadId;
                if (!threadId) return;

                const link = cell.querySelector('.cat-cell-link');
                if (!link) return;

                // 状態リセット
                const existingDiff = link.querySelector('.res-diff-added');
                if (existingDiff) existingDiff.remove();
                cell.classList.remove('res-diff-has-new');

                const record = history[threadId];
                if (!record) return;

                const spans = Array.from(link.querySelectorAll('span'));
                const countSpan = spans.find(s => /^\d+$/.test(s.textContent.trim()));

                if (countSpan) {
                    const currentCount = parseInt(countSpan.textContent.trim(), 10);
                    const prevCount = record.resCount;
                    const diff = currentCount - prevCount;

                    if (diff > 0) {
                        const diffSpan = document.createElement('span');
                        diffSpan.className = 'res-diff-added';
                        diffSpan.textContent = `+${diff}`;
                        countSpan.after(diffSpan);

                        cell.classList.add('res-diff-has-new');
                    }
                }
            });
        };

        applyDiffDisplay();

        const observer = new MutationObserver(() => {
            observer.disconnect();
            applyDiffDisplay();
            observer.observe(table, { childList: true, subtree: true });
        });
        observer.observe(table, { childList: true, subtree: true });

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') applyDiffDisplay();
        });
        window.addEventListener('storage', (e) => {
            if (e.key === STORAGE_KEY) applyDiffDisplay();
        });
    }

    // --- 過去ログ判定処理 (API使用) ---
    async function handleHistoryMode() {
        try {
            // APIから生存スレッド一覧を取得
            const res = await fetch('/api/threads?limit=500');
            if (!res.ok) return;

            const data = await res.json();
            const threads = data.threads || (data.data && data.data.threads) || [];
            const liveThreadIds = new Set(threads.map(t => String(t.id)));

            const cells = document.querySelectorAll('.cat-cell');
            cells.forEach(cell => {
                const threadId = cell.dataset.threadId;
                if (threadId) {
                    if (!liveThreadIds.has(threadId)) {
                        cell.classList.add('is-past-log');
                    }
                }
            });

        } catch (e) {
            console.error('[ResDiff] Failed to fetch live threads for past-log check', e);
        }
    }
})();