// ==UserScript==
// @name         あいもげスクロール位置記憶ちゃん
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  スレッドを閉じた時の位置を記憶して、再度開いた時に同じ位置から表示
// @author       You
// @match        https://nijiurachan.net/pc/thread.php*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557138/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E3%82%B9%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%AB%E4%BD%8D%E7%BD%AE%E8%A8%98%E6%86%B6%E3%81%A1%E3%82%83%E3%82%93.user.js
// @updateURL https://update.greasyfork.org/scripts/557138/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E3%82%B9%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%AB%E4%BD%8D%E7%BD%AE%E8%A8%98%E6%86%B6%E3%81%A1%E3%82%83%E3%82%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('=== あいもげスクロール位置記憶ちゃん ===');

    // 現在のスレッドIDを取得
    function getThreadId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    // スクロール位置を保存
    function saveScrollPosition() {
        const threadId = getThreadId();
        if (!threadId) return;

        const scrollData = {
            position: window.scrollY,
            timestamp: Date.now()
        };

        try {
            localStorage.setItem(`scroll_pos_${threadId}`, JSON.stringify(scrollData));
            console.log(`✓ スクロール位置保存: スレッド${threadId}, 位置${scrollData.position}px`);
        } catch (e) {
            console.error('保存エラー:', e);
        }
    }

    // スクロール位置を復元（複数回試行）
    function restoreScrollPosition(attempt = 0) {
        const threadId = getThreadId();
        if (!threadId) {
            console.log('スレッドIDなし');
            return;
        }

        try {
            const saved = localStorage.getItem(`scroll_pos_${threadId}`);
            if (!saved) {
                console.log('保存データなし');
                return;
            }

            const scrollData = JSON.parse(saved);
            console.log(`保存データ発見: 位置${scrollData.position}px`);
            
            // 24時間以上前のデータは無視
            const dayInMs = 24 * 60 * 60 * 1000;
            if (Date.now() - scrollData.timestamp > dayInMs) {
                console.log('24時間以上経過のため削除');
                localStorage.removeItem(`scroll_pos_${threadId}`);
                return;
            }

            // ページの高さをチェック
            const pageHeight = document.documentElement.scrollHeight;
            console.log(`現在のページ高さ: ${pageHeight}px`);

            // スクロール位置がページ高さより大きい場合は待機
            if (scrollData.position > pageHeight - window.innerHeight && attempt < 10) {
                console.log(`ページ高さ不足、再試行 ${attempt + 1}/10`);
                setTimeout(() => restoreScrollPosition(attempt + 1), 300);
                return;
            }

            // スクロール位置を復元
            console.log(`→ スクロール実行: ${scrollData.position}px`);
            window.scrollTo({
                top: scrollData.position,
                behavior: 'instant' // スムーズではなく即座に
            });

            // 確認
            setTimeout(() => {
                console.log(`実際のスクロール位置: ${window.scrollY}px`);
                if (Math.abs(window.scrollY - scrollData.position) > 50) {
                    // 50px以上ずれている場合は再試行
                    if (attempt < 5) {
                        console.log('位置がずれている、再試行');
                        restoreScrollPosition(attempt + 1);
                    }
                } else {
                    showNotification(`スクロール位置を復元しました（${Math.round(scrollData.position)}px）`);
                }
            }, 100);

        } catch (e) {
            console.error('復元エラー:', e);
        }
    }

    // 通知を表示
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 99999;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.3s;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2500);
    }

    // 古いデータをクリーンアップ
    function cleanupOldData() {
        try {
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('scroll_pos_')) {
                    keys.push(key);
                }
            }

            if (keys.length > 100) {
                const dataWithTime = keys.map(key => {
                    try {
                        const data = JSON.parse(localStorage.getItem(key));
                        return { key, timestamp: data.timestamp || 0 };
                    } catch {
                        return { key, timestamp: 0 };
                    }
                }).sort((a, b) => a.timestamp - b.timestamp);

                for (let i = 0; i < 50; i++) {
                    localStorage.removeItem(dataWithTime[i].key);
                }
                console.log('古いデータを50件削除');
            }
        } catch (e) {
            console.error('クリーンアップエラー:', e);
        }
    }

    // スクロール位置を定期的に保存
    let saveTimeout = null;
    window.addEventListener('scroll', function() {
        if (saveTimeout) clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveScrollPosition, 500);
    });

    // ページ離脱時に保存
    window.addEventListener('beforeunload', function() {
        saveScrollPosition();
        console.log('ページ離脱時に保存');
    });

    // ページ非表示時に保存
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            saveScrollPosition();
            console.log('タブ非表示時に保存');
        }
    });

    // 初期化
    function init() {
        console.log('=== 初期化開始 ===');
        console.log('スレッドID:', getThreadId());
        
        cleanupOldData();

        // 画像の読み込みを待つ
        if (document.readyState === 'complete') {
            console.log('ページ完全読み込み済み、即座に復元');
            restoreScrollPosition();
        } else {
            window.addEventListener('load', function() {
                console.log('loadイベント発火、復元開始');
                setTimeout(() => restoreScrollPosition(), 300);
            });
            
            // loadイベントを待ちながら、とりあえず試す
            setTimeout(() => {
                console.log('1秒後に復元試行');
                restoreScrollPosition();
            }, 1000);
        }
    }

    // 実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
