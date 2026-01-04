// ==UserScript==
// @name         CCFOLIA Auto Close Chat Bubble
// @namespace    https://github.com/
// @version      2.0
// @description  ココフォリアのメッセージ吹き出しのみを、表示完了から5秒後に自動的に閉じます。
// @author       User
// @match        https://ccfolia.com/rooms/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ccfolia.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557123/CCFOLIA%20Auto%20Close%20Chat%20Bubble.user.js
// @updateURL https://update.greasyfork.org/scripts/557123/CCFOLIA%20Auto%20Close%20Chat%20Bubble.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================
    // 設定エリア
    // =================================================================
    const CONFIG = {
        // 表示完了後、閉じるまでの待機時間 (ミリ秒)
        WAIT_TIME: 5000,

        // 文字送りが止まったとみなすバッファ時間
        STABILITY_TIME: 500,

        // デバッグログを表示するかどうか
        DEBUG_MODE: false
    };

    // =================================================================
    // 内部処理
    // =================================================================
    const TOTAL_DELAY = CONFIG.WAIT_TIME + CONFIG.STABILITY_TIME;
    const managedButtons = new WeakSet();

    function log(...args) {
        if (CONFIG.DEBUG_MODE) console.log('[AutoClose]', ...args);
    }

    /**
     * 指定されたボタンが「無視すべき（閉じてはいけない）ボタン」か判定する
     * @param {HTMLElement} btn - 判定対象の閉じるボタン
     * @returns {boolean} trueなら無視する（自動で閉じない）
     */
    function isIgnoredButton(btn) {
        // 1. ドロワー (右サイドバーのチャットログなど) 内は無視
        if (btn.closest('.MuiDrawer-root')) return true;

        // 2. ダイアログ (モーダルウィンドウ) 内は無視
        if (btn.closest('[role="dialog"]') || btn.closest('.MuiDialog-root')) return true;

        // 3. Draggable要素 (キャラクター一覧、シーン一覧、スクリーンパネル一覧など) は無視
        // ココフォリアのウィンドウUIは `aria-roledescription="draggable"` を持つ親要素の中にあります
        if (btn.closest('[aria-roledescription="draggable"]')) return true;
        if (btn.closest('[aria-roledescription="sortable"]')) return true; // リストの並び替え可能な要素も念のため除外

        // --- コンテナベースの判定 ---
        // ボタンを含む最小の「Paper」または「Card」要素を取得
        const container = btn.closest('div[class*="MuiPaper"]') || btn.closest('div[class*="MuiCard"]') || btn.parentElement?.parentElement;

        if (!container) return false; // コンテナが見つからなければ（念のため）処理対象にする

        // 4. 入力フォームを含む場合は無視 (編集画面、チャット入力欄など)
        if (container.querySelector('input, textarea, select')) return true;

        // 5. ズーム機能・スライダーを含む場合は無視 (画像拡大表示、BGM調整パネルなど)
        // ZoomInIcon, ZoomOutIcon, MuiSlider などが含まれているかチェック
        if (container.querySelector('[data-testid="ZoomInIcon"]') ||
            container.querySelector('[data-testid="ZoomOutIcon"]') ||
            container.querySelector('.MuiSlider-root')) {
            return true;
        }

        // 6. 編集ボタンを含む場合は無視 (ステータス編集など)
        if (container.querySelector('[data-testid="EditIcon"]')) return true;

        // 7. リスト構造 (ul/ol) がメインのコンテンツの場合は無視 (一覧系UIの予備判定)
        // ただし、吹き出し内に装飾としてリストが入る可能性もゼロではないため、
        // コンテナの高さが大きい、またはスクロール可能なクラスを持つ場合などを除外基準にする
        if (container.querySelector('ul.MuiList-root') && container.scrollHeight > 200) {
            return true;
        }

        return false; // ここまで該当しなければ「吹き出し」とみなして閉じる対象にする
    }

    /**
     * 閉じるボタンに対して監視イベントとタイマーを設定する
     * @param {HTMLElement} closeBtn - 閉じるボタン要素
     */
    function setupAutoClose(closeBtn) {
        if (managedButtons.has(closeBtn)) return;

        // 無視すべきボタンなら管理セットに追加して終了
        if (isIgnoredButton(closeBtn)) {
            managedButtons.add(closeBtn);
            log('Ignored button found:', closeBtn);
            return;
        }

        managedButtons.add(closeBtn);
        log('Target button detected:', closeBtn);

        // 監視対象のコンテナ（テキストが変わる範囲）
        const container = closeBtn.closest('div[class*="MuiPaper"]') ||
                          closeBtn.parentElement?.parentElement;

        let closeTimer = null;

        // 閉じる実行関数
        const executeClose = () => {
            if (document.body.contains(closeBtn)) { // まだDOMに存在する場合のみ
                log('Closing chat bubble automatically.');
                closeBtn.click();
            }
        };

        // タイマーリセット関数
        const resetTimer = () => {
            if (closeTimer) clearTimeout(closeTimer);
            closeTimer = setTimeout(executeClose, TOTAL_DELAY);
        };

        // コンテナ内のテキスト変化（文字送り）を監視
        if (container) {
            const textObserver = new MutationObserver(() => {
                resetTimer();
            });
            textObserver.observe(container, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }

        // 初回タイマーセット
        resetTimer();
    }

    /**
     * ノードリスト内から対象の閉じるボタンを探し出す
     */
    function scanNodesForButtons(nodes) {
        // 閉じるボタンの特定:
        // 1. button要素で aria-label="閉じる" を持つ
        // 2. または button要素の中に data-testid="CloseIcon" のSVGを持つ
        const selectors = 'button[aria-label="閉じる"], button svg[data-testid="CloseIcon"]';

        nodes.forEach(node => {
            // 要素ノードでなければスキップ
            if (node.nodeType !== Node.ELEMENT_NODE) return;

            // ノード自体がターゲットまたはターゲットを含む場合
            // querySelectorAllは自分自身を含まないため、matchesで自身もチェック
            let targets = [];
            if (node.matches && node.matches('button')) {
                // node自体がボタンの場合のチェック
                if (node.matches('[aria-label="閉じる"]') || node.querySelector('svg[data-testid="CloseIcon"]')) {
                    targets.push(node);
                }
            }

            // 子孫要素から検索
            const children = node.querySelectorAll(selectors);
            children.forEach(child => {
                // SVGがヒットした場合は親のbuttonを取得、buttonならそのまま
                const btn = child.tagName.toLowerCase() === 'button' ? child : child.closest('button');
                if (btn) targets.push(btn);
            });

            // 重複を除去して登録
            new Set(targets).forEach(btn => setupAutoClose(btn));
        });
    }

    // =================================================================
    // 監視の開始
    // =================================================================
    const mainObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                scanNodesForButtons(mutation.addedNodes);
            }
        });
    });

    // body全体を監視
    mainObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初期ロード時に既に表示されている要素にも適用
    scanNodesForButtons([document.body]);

})();