// ==UserScript==
// @name         あいもげ棒読みちゃん連携
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  aimgの新着レスをHTTP連携で棒読みちゃんに転送
// @homepageURL  https://greasyfork.org/ja/scripts/557715
// @author       yofumin
// @match        https://nijiurachan.net/pc/thread*
// @icon         https://nijiurachan.net/favicon.ico
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557715/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E6%A3%92%E8%AA%AD%E3%81%BF%E3%81%A1%E3%82%83%E3%82%93%E9%80%A3%E6%90%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/557715/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E6%A3%92%E8%AA%AD%E3%81%BF%E3%81%A1%E3%82%83%E3%82%93%E9%80%A3%E6%90%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 設定パラメータ
    // ==========================================
    const CONFIG = {
        BOUYOMI_PORT: 50080,         // 棒読みちゃんのHTTP連携ポート
        TARGET_SELECTOR: 'div[data-thread-container=""]', // 監視対象
        RETRY_INTERVAL: 1000,        // 親要素再検索間隔(ms)
        SEND_INTERVAL: 500,          // 読み上げ送信間隔(ms)
        INITIAL_COOL_TIME: 5000,     // 初期ロード対策：起動後何ミリ秒読み上げを無効にするか
        AUTO_RELOAD_INTERVAL: 15000  // 自動リロード間隔(ms) ※15秒以上推奨
    };

    // ==========================================
    // 状態管理変数
    // ==========================================
    const State = {
        isSpeakEnabled: false,
        isReloadEnabled: false,
        isInitializing: true,
        speakQueue: [],
        isSending: false,
        processedIds: new Set(),
        reloadTimerId: null,
        observer: null
    };

    let uiRefs = { reloadBtn: null, progressBar: null };

    // ==========================================
    // UI作成
    // ==========================================
    function createPanel() {
        if (document.getElementById('bouyomi-panel-container')) return;

        const container = document.createElement('div');
        container.id = 'bouyomi-panel-container';
        Object.assign(container.style, {
            position: 'fixed', bottom: '20px', right: '20px', zIndex: '99999',
            display: 'flex', flexDirection: 'column', gap: '8px',
            fontFamily: 'sans-serif', userSelect: 'none'
        });

        const createBtnStyle = (btn) => {
            Object.assign(btn.style, {
                padding: '8px 12px', borderRadius: '5px', cursor: 'pointer',
                fontSize: '13px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                textAlign: 'center', minWidth: '140px', transition: 'all 0.2s',
                position: 'relative', overflow: 'hidden'
            });
        };

        // 読み上げボタン
        const speakBtn = document.createElement('div');
        createBtnStyle(speakBtn);
        const updateSpeakBtn = () => {
            if (State.isSpeakEnabled) {
                speakBtn.innerText = '🔊 読み上げ ON';
                speakBtn.style.backgroundColor = '#d4edda'; speakBtn.style.color = '#155724';
                speakBtn.style.border = '1px solid #c3e6cb';
            } else {
                speakBtn.innerText = '🔇 読み上げ OFF';
                speakBtn.style.backgroundColor = '#f8d7da'; speakBtn.style.color = '#721c24';
                speakBtn.style.border = '1px solid #f5c6cb';
            }
        };
        speakBtn.onclick = () => {
            State.isSpeakEnabled = !State.isSpeakEnabled;
            updateSpeakBtn();
            if (!State.isSpeakEnabled) State.speakQueue = [];
        };

        // リロードボタン
        const reloadBtn = document.createElement('div');
        createBtnStyle(reloadBtn);
        uiRefs.reloadBtn = reloadBtn;
        const progressBar = document.createElement('div');
        Object.assign(progressBar.style, {
            position: 'absolute', bottom: '0', left: '0', height: '4px',
            backgroundColor: '#0056b3', width: '0%', transition: 'none', opacity: '0.7'
        });
        uiRefs.progressBar = progressBar;
        reloadBtn.appendChild(progressBar);

        const updateReloadBtn = () => {
            if (State.isReloadEnabled) {
                reloadBtn.innerText = `🔄 自動更新 ON`;
                reloadBtn.appendChild(progressBar);
                reloadBtn.style.backgroundColor = '#cce5ff'; reloadBtn.style.color = '#004085';
                reloadBtn.style.border = '1px solid #b8daff';
            } else {
                reloadBtn.innerText = '⏸ 自動更新 OFF';
                progressBar.style.width = '0%';
                reloadBtn.appendChild(progressBar);
                reloadBtn.style.backgroundColor = '#e2e3e5'; reloadBtn.style.color = '#383d41';
                reloadBtn.style.border = '1px solid #d6d8db';
            }
        };
        reloadBtn.onclick = () => {
            toggleAutoReload(!State.isReloadEnabled);
            updateReloadBtn();
        };

        updateSpeakBtn();
        updateReloadBtn();
        container.appendChild(speakBtn);
        container.appendChild(reloadBtn);
        document.body.appendChild(container);
    }

    // ==========================================
    // 自動リロード機能
    // ==========================================
    function toggleAutoReload(enable) {
        State.isReloadEnabled = enable;
        if (State.reloadTimerId) { clearInterval(State.reloadTimerId); State.reloadTimerId = null; }
        const bar = uiRefs.progressBar;
        if (bar) { bar.style.transition = 'none'; bar.style.width = '0%'; }
        if (enable) executeReloadCycle();
    }

    function executeReloadCycle() {
        if (!State.isReloadEnabled) return;
        const bar = uiRefs.progressBar;
        if (bar) {
            bar.style.transition = 'none'; bar.style.width = '0%';
            requestAnimationFrame(() => { requestAnimationFrame(() => {
                bar.style.transition = `width ${CONFIG.AUTO_RELOAD_INTERVAL}ms linear`;
                bar.style.width = '100%';
            }); });
        }
        State.reloadTimerId = setTimeout(() => {
            executeReload();
            executeReloadCycle();
        }, CONFIG.AUTO_RELOAD_INTERVAL);
    }

    function executeReload() {
        // リロードボタンをクリックする物理方式
        const reloadLink = document.querySelector('#contres a');
        if (reloadLink) {
            reloadLink.click();
        } else {
             const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
             if (typeof win.reloadThread === 'function') {
                 win.reloadThread();
             } else {
                 console.error("[Talk] リロードボタンが見つかりません");
                 toggleAutoReload(false);
             }
        }
    }

    // ==========================================
    // 読み上げ・解析
    // ==========================================
    function enqueueText(text) {
        if (!text || !State.isSpeakEnabled || State.isInitializing) return;
        State.speakQueue.push(text);
        processQueue();
    }
    function processQueue() {
        if (State.isSending || State.speakQueue.length === 0) return;
        if (!State.isSpeakEnabled) { State.speakQueue = []; return; }
        State.isSending = true;
        const text = State.speakQueue.shift();
        sendToBouyomichan(text, () => {
            setTimeout(() => { State.isSending = false; processQueue(); }, CONFIG.SEND_INTERVAL);
        });
    }
    function sendToBouyomichan(text, onComplete) {
        GM_xmlhttpRequest({
            method: "GET", url: `http://localhost:${CONFIG.BOUYOMI_PORT}/Talk?text=${encodeURIComponent(text)}`,
            onload: () => { if (onComplete) onComplete(); },
            onerror: () => { if (onComplete) onComplete(); }
        });
    }

    // IDチェックとテキスト抽出
    function processNode(node) {
        if (!node || node.nodeType !== Node.ELEMENT_NODE) return;

        let replyId = node.getAttribute('data-reply-id');
        if (!replyId) {
            const childTable = node.querySelector('table[data-reply-id]');
            if (childTable) replyId = childTable.getAttribute('data-reply-id');
        }

        if (replyId) {
            if (State.processedIds.has(replyId)) return;
            State.processedIds.add(replyId);
        }

        if (State.isInitializing) return;

        const blockquote = node.querySelector('blockquote');
        if (blockquote) {
            const text = blockquote.innerText.trim();
            if (text.length > 0) enqueueText(text);
        }
    }


    function scanAddedNode(node) {
        if (node.nodeType !== Node.ELEMENT_NODE) return;


        if (node.tagName === 'TABLE' && node.hasAttribute('data-reply-id')) {
            processNode(node);
            return;
        }

        const tables = node.querySelectorAll('table[data-reply-id]');
        if (tables.length > 0) {
            tables.forEach(table => processNode(table));
            return;
        }

        processNode(node);
    }

    // ==========================================
    // 監視セットアップ
    // ==========================================
    function startObserver() {
        const targetContainer = document.querySelector(CONFIG.TARGET_SELECTOR);

        if (!targetContainer) {
            setTimeout(startObserver, CONFIG.RETRY_INTERVAL);
            return;
        }

        // 既存レスを登録
        const existingRes = targetContainer.querySelectorAll('table[data-reply-id]');
        existingRes.forEach(table => {
            const id = table.getAttribute('data-reply-id');
            if (id) State.processedIds.add(id);
        });

        // 親要素を監視（subtree: true で子孫の変動も全て検知する）
        State.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => scanAddedNode(node));
                }
            });
        });

        State.observer.observe(targetContainer, { childList: true, subtree: true });
        console.log("[Talk] 監視を開始しました (Container Mode)");

        if (State.isInitializing) {
            setTimeout(() => {
                State.isInitializing = false;
                console.log("[Talk] クールタイム終了");
            }, CONFIG.INITIAL_COOL_TIME);
        }
    }

    // ==========================================
    // 実行開始
    // ==========================================
    const init = () => {
        createPanel();
        startObserver();
    };

    if (document.readyState === 'complete') { init(); } else { window.addEventListener('load', init); }

})();