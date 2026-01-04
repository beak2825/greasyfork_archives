// ==UserScript==
// @name         YouTube履歴 簡単削除ボタン (SPA対応版)
// @name:en      YouTube History Quick Delete Button (SPA-Compatible Version)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  YouTube履歴ページの各動画に大きな削除ボタンを追加（SPA遷移対応）
// @description:en  Added large delete buttons to each video on the YouTube history page (supports SPA transitions)
// @author       tofulix
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-idle
 // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553673/YouTube%E5%B1%A5%E6%AD%B4%20%E7%B0%A1%E5%8D%98%E5%89%8A%E9%99%A4%E3%83%9C%E3%82%BF%E3%83%B3%20%28SPA%E5%AF%BE%E5%BF%9C%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553673/YouTube%E5%B1%A5%E6%AD%B4%20%E7%B0%A1%E5%8D%98%E5%89%8A%E9%99%A4%E3%83%9C%E3%82%BF%E3%83%B3%20%28SPA%E5%AF%BE%E5%BF%9C%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[YouTube Easy Delete] Script loaded');

    // グローバル変数
    let processedVideos = new WeakSet(); // 処理済み要素を追跡
    let mutationObserver = null;
    let scrollTimeout = null;
    let isHistoryPage = false;
    let lastUrl = location.href;

    /**
     * 現在のページが履歴ページかどうかを判定
     */
    function checkIsHistoryPage() {
        const url = location.href;
        const isHistory = url.includes('/feed/history');
        console.log(`[YouTube Easy Delete] Current URL: ${url}, Is History Page: ${isHistory}`);
        return isHistory;
    }

    /**
     * プログラマティックにメニューを開いて削除を実行
     */
    async function deleteVideoByMenu(videoElement) {
        return new Promise((resolve, reject) => {
            try {
                // 1. メニューボタンを取得
                const menuButton = videoElement.querySelector('yt-lockup-metadata-view-model button');
                if (!menuButton) {
                    throw new Error('Menu button not found');
                }

                console.log('[YouTube Easy Delete] Opening menu...');

                // 2. メニューボタンをクリック
                menuButton.click();

                // 3. メニューが開くまで少し待つ
                setTimeout(() => {
                    try {
                        // 4. 開いたメニューを取得
                        const sheet = document.querySelector('yt-sheet-view-model');
                        if (!sheet) {
                            throw new Error('Menu sheet not found');
                        }

                        // 5. メニュー内の全アイテムを取得
                        const items = sheet.querySelectorAll('yt-list-item-view-model');
                        console.log(`[YouTube Easy Delete] Found ${items.length} menu items`);

                        // 6. 「再生履歴から削除」ボタンを探す
                        const deleteButton = Array.from(items).find(item => {
                            const text = item.textContent.trim();
                            return text.includes('再生履歴から削除') ||
                                   text.includes('履歴から削除') ||
                                   text.includes('Remove from watch history');
                        });

                        if (!deleteButton) {
                            // メニューを閉じる
                            document.body.click();
                            throw new Error('Delete button not found in menu');
                        }

                        console.log('[YouTube Easy Delete] Clicking delete button...');

                        // 7. 削除ボタンをクリック
                        deleteButton.click();

                        // 8. 少し待ってから成功を返す
                        setTimeout(() => {
                            resolve();
                        }, 300);

                    } catch (error) {
                        // メニューを閉じる
                        document.body.click();
                        reject(error);
                    }
                }, 200);

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 削除ボタンを追加
     */
    function addDeleteButton(videoElement) {
        // 履歴ページでない場合は何もしない
        if (!isHistoryPage) {
            return;
        }

        // 既に処理済みならスキップ
        if (processedVideos.has(videoElement)) {
            return;
        }
        processedVideos.add(videoElement);

        // メニューボタンが存在するか確認
        const menuButton = videoElement.querySelector('yt-lockup-metadata-view-model button');
        if (!menuButton) {
            console.warn('[YouTube Easy Delete] Menu button not found for element:', videoElement);
            return;
        }

        // 削除ボタンを作成
        const deleteButton = document.createElement('button');
        deleteButton.className = 'yt-history-delete-btn';
        deleteButton.textContent = '🗑️ 削除';
        deleteButton.style.cssText = `
            position: absolute;
            right: -120px;
            top: 50%;
            transform: translateY(-50%);
            padding: 12px 20px;
            background: linear-gradient(135deg, #e53935 0%, #c62828 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            z-index: 1000;
            transition: all 0.2s ease;
        `;

        // ホバー効果
        deleteButton.addEventListener('mouseenter', () => {
            deleteButton.style.background = 'linear-gradient(135deg, #c62828 0%, #b71c1c 100%)';
            deleteButton.style.transform = 'translateY(-50%) scale(1.05)';
            deleteButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
        });

        deleteButton.addEventListener('mouseleave', () => {
            deleteButton.style.background = 'linear-gradient(135deg, #e53935 0%, #c62828 100%)';
            deleteButton.style.transform = 'translateY(-50%) scale(1)';
            deleteButton.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        });

        // クリックイベント
        deleteButton.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            // ローディング状態
            deleteButton.disabled = true;
            deleteButton.textContent = '⏳ 削除中...';
            deleteButton.style.opacity = '0.6';

            try {
                await deleteVideoByMenu(videoElement);

                // 成功：要素をフェードアウトして削除
                videoElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                videoElement.style.opacity = '0';
                videoElement.style.transform = 'translateX(-20px)';

                setTimeout(() => {
                    videoElement.remove();
                    console.log('[YouTube Easy Delete] Video deleted successfully');
                }, 300);

            } catch (error) {
                console.error('[YouTube Easy Delete] Delete failed:', error);
                alert('削除に失敗しました: ' + error.message);
                deleteButton.disabled = false;
                deleteButton.textContent = '🗑️ 削除';
                deleteButton.style.opacity = '1';
            }
        });

        // ボタンを追加（親要素を相対配置に）
        videoElement.style.position = 'relative';
        videoElement.appendChild(deleteButton);

        console.log('[YouTube Easy Delete] Button added');
    }

    /**
     * 全削除ボタンを削除
     */
    function removeAllDeleteButtons() {
        const buttons = document.querySelectorAll('.yt-history-delete-btn');
        buttons.forEach(button => button.remove());
        processedVideos = new WeakSet(); // リセット
        console.log(`[YouTube Easy Delete] Removed ${buttons.length} delete buttons`);
    }

    /**
     * 全動画に削除ボタンを追加
     */
    function processAllVideos() {
        if (!isHistoryPage) {
            return;
        }

        const videos = document.querySelectorAll('yt-lockup-view-model');
        videos.forEach(video => {
            addDeleteButton(video);
        });
    }

    /**
     * MutationObserverで動的追加に対応
     */
    function startObserver() {
        if (mutationObserver) {
            return; // 既に起動している
        }

        mutationObserver = new MutationObserver(mutations => {
            if (!isHistoryPage) {
                return; // 履歴ページでない場合は何もしない
            }

            let hasNewVideos = false;

            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        // ytd-item-section-rendererが追加された場合（スクロール時の新規読み込み）
                        if (node.matches && node.matches('ytd-item-section-renderer')) {
                            console.log('[YouTube Easy Delete] New section detected');
                            hasNewVideos = true;
                        }

                        // 新しく追加された動画要素を処理
                        if (node.matches && node.matches('yt-lockup-view-model')) {
                            hasNewVideos = true;
                        }

                        // 子要素も確認
                        if (node.querySelectorAll) {
                            const sections = node.querySelectorAll('ytd-item-section-renderer');
                            if (sections.length > 0) {
                                console.log(`[YouTube Easy Delete] Found ${sections.length} new sections in added node`);
                                hasNewVideos = true;
                            }

                            const videos = node.querySelectorAll('yt-lockup-view-model');
                            if (videos.length > 0) {
                                hasNewVideos = true;
                            }
                        }
                    }
                });
            });

            // 新しい動画が追加された場合
            if (hasNewVideos) {
                setTimeout(() => {
                    processAllVideos();
                }, 100);
            }
        });

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('[YouTube Easy Delete] MutationObserver started');
    }

    /**
     * MutationObserverを停止
     */
    function stopObserver() {
        if (mutationObserver) {
            mutationObserver.disconnect();
            mutationObserver = null;
            console.log('[YouTube Easy Delete] MutationObserver stopped');
        }
    }

    /**
     * スクロールイベントハンドラを追加
     */
    function startScrollListener() {
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    /**
     * スクロールイベントハンドラを削除
     */
    function stopScrollListener() {
        window.removeEventListener('scroll', handleScroll);
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
            scrollTimeout = null;
        }
    }

    /**
     * スクロールハンドラ
     */
    function handleScroll() {
        if (!isHistoryPage) {
            return;
        }

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            processAllVideos();
        }, 500);
    }

    /**
     * ページの状態を更新
     */
    function updatePageState() {
        const wasHistoryPage = isHistoryPage;
        isHistoryPage = checkIsHistoryPage();

        if (wasHistoryPage && !isHistoryPage) {
            // 履歴ページから他のページへ遷移した
            console.log('[YouTube Easy Delete] Left history page - cleaning up');
            removeAllDeleteButtons();
            stopObserver();
            stopScrollListener();
        } else if (!wasHistoryPage && isHistoryPage) {
            // 他のページから履歴ページへ遷移した
            console.log('[YouTube Easy Delete] Entered history page - initializing');
            setTimeout(() => {
                processAllVideos();
                startObserver();
                startScrollListener();
            }, 1000);
        }
    }

    /**
     * URL変更を監視
     */
    function watchUrlChanges() {
        // yt-navigate-finishイベントをリッスン（YouTubeのSPAナビゲーション完了イベント）
        document.addEventListener('yt-navigate-finish', () => {
            console.log('[YouTube Easy Delete] Navigation detected (yt-navigate-finish)');
            updatePageState();
        });

        // popstateイベントもリッスン（ブラウザの戻る/進むボタン）
        window.addEventListener('popstate', () => {
            console.log('[YouTube Easy Delete] Navigation detected (popstate)');
            updatePageState();
        });

        // pushStateとreplaceStateをフック（プログラマティックなナビゲーション）
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function() {
            originalPushState.apply(this, arguments);
            console.log('[YouTube Easy Delete] Navigation detected (pushState)');
            setTimeout(updatePageState, 100);
        };

        history.replaceState = function() {
            originalReplaceState.apply(this, arguments);
            console.log('[YouTube Easy Delete] Navigation detected (replaceState)');
            setTimeout(updatePageState, 100);
        };

        // 定期的にURLをチェック（念のため）
        setInterval(() => {
            if (location.href !== lastUrl) {
                console.log('[YouTube Easy Delete] URL change detected via polling');
                lastUrl = location.href;
                updatePageState();
            }
        }, 1000);

        console.log('[YouTube Easy Delete] URL change watchers initialized');
    }

    /**
     * 初期化
     */
    function init() {
        // ページが完全に読み込まれるまで待機
        if (!window.ytInitialData) {
            console.log('[YouTube Easy Delete] Waiting for ytInitialData...');
            setTimeout(init, 500);
            return;
        }

        console.log('[YouTube Easy Delete] Initializing...');

        // URL変更の監視を開始
        watchUrlChanges();

        // 初期状態をチェック
        updatePageState();
    }

    // スクリプト開始
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();