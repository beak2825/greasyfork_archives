// ==UserScript==
// @name         AIMG Viewed Thread Highlighter
// @name:ja      あいもげ既読スレ背景色変更
// @namespace    https://nijiurachan.net/pc/catalog.php
// @version      1.2
// @description  既読スレッドの背景色を変更
// @author       doridoridoridorin
// @match        https://nijiurachan.net/pc/catalog*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557492/AIMG%20Viewed%20Thread%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/557492/AIMG%20Viewed%20Thread%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // 設定：カラー定義
    // ==========================================
    const COLOR_LIGHT = '#ffe0b2'; // 通常モード用カラー
    const COLOR_DARK = '#192f60';  // ダークモード用カラー

    // ==========================================
    // 設定：img用定義
    // ==========================================
    const TARGET_URL_PREFIX = 'https://img.2chan.net/b/res/'; // 対象とするURLの開始文字列
    const STORAGE_KEY = 'fvt_timed_history'; // 保存場所のキー名
    const EXPIRE_HOURS = 3; // 何時間で履歴を消すか

    // ==========================================
    // CSSスタイルの定義と注入
    // ==========================================

    const css = `
        /* --- ライトモード (デフォルト) --- */
        /* .fvt-viewed クラスがついた要素の背景色を変更 */
        td.fvt-viewed {
            background-color: ${COLOR_LIGHT} !important;
            transition: background-color 0.3s ease;
        }

        /* --- ダークモード対応 2: サイト内設定 --- */
        /* サイト側のCSSが "body.dark-mode #cattable td" 勝つためIDセレクタ(#cattable)を含めて指定を強く*/
        body.dark-mode #cattable td.fvt-viewed,
        body.dark-mode td.fvt-viewed {
            background-color: ${COLOR_DARK} !important;
            color: #e0e0e0 !important;
            transition: background-color 0.3s ease;
        }
    `;

    // 作成したCSSをページに適用
    GM_addStyle(css);

    // ==========================================
    // ストレージから既読のスレッドを取得する
    // ==========================================
    function getViewedThreadIds() {
        try {
            // ローカルストレージから文字列を取得
            const raw = localStorage.getItem('futaba_viewed_threads');
            if (!raw) return new Set();

            // JSON文字列を配列に変換
            const parsed = JSON.parse(raw);

            // 配列を数値に変換しつつSetにする
            if (Array.isArray(parsed)) {
                return new Set(parsed.map(id => Number(id)));
            }
        } catch (e) {
            // JSONが壊れていた場合などのエラー対策
            console.error('JSON parse error in futaba_viewed_threads:', e);
        }
        return new Set();
    }

    // ==========================================
    // ストレージから有効な(期限切れでない)URLリストを取得する
    // 期限切れデータをストレージから削除(掃除)する
    // ==========================================
    function getValidUrlSet() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return new Set();

            const history = JSON.parse(raw); // 形式: [{url: "...", time: 123456789}, ...]
            if (!Array.isArray(history)) return new Set();

            const now = Date.now();
            const expireMs = EXPIRE_HOURS * 60 * 60 * 1000; // 時間をミリ秒に変換

            // 有効期限内のデータだけを残す
            const validHistory = history.filter(item => {
                return (now - item.time) < expireMs;
            });

            // もし期限切れデータがあって数が減っていたら、掃除後のデータを保存し直す
            if (validHistory.length !== history.length) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(validHistory));
            }

            // 検索しやすいようにURLだけのSetにして返す
            return new Set(validHistory.map(item => item.url));

        } catch (e) {
            console.error('Data load error:', e);
            return new Set();
        }
    }

    // ==========================================
    // URLを現在時刻で保存する
    // ==========================================
    function saveClickedUrl(url) {
        try {
            // まず現状の生データを取得
            const raw = localStorage.getItem(STORAGE_KEY);
            let history = raw ? JSON.parse(raw) : [];
            if (!Array.isArray(history)) history = [];

            const now = Date.now();

            // 既に同じURLがある場合は、一旦削除して「最新の時刻」で登録し直す
            history = history.filter(item => item.url !== url);

            // 新しいデータを追加
            history.push({
                url: url,
                time: now
            });

            // 保存
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));

            // 画面反映
            updateHighlights();

        } catch (e) {
            console.error('Data save error:', e);
        }
    }

    // ==========================================
    // 画面上のスレッド(td)を確認し、既読ならクラスを付与、未読なら外す
    // ==========================================
    function updateHighlights() {
        // 最新の既読リストを取得
        const viewedIds = getViewedThreadIds();

        // data-thread-id 属性を持っている tdタグを全て取得
        const targets = document.querySelectorAll('td[data-thread-id]');

        targets.forEach(td => {
            // 属性は文字列なので数値に変換
            const threadId = Number(td.getAttribute('data-thread-id'));

            // Setの中にIDがあるか確認
            if (viewedIds.has(threadId)) {
                td.classList.add('fvt-viewed'); // クラスを付与 -> CSSで色がつく
            } else {
                td.classList.remove('fvt-viewed'); // クラスを削除
            }
        });

        // 有効なURL一覧を取得 (この時点で期限切れは除外されている)
        const validUrls = getValidUrlSet();

        // tdタグの中にある data-thread-id属性を持っていない aタグを全て取得
        const links = document.querySelectorAll('td:not([data-thread-id]) a');

        links.forEach(a => {
            const href = a.href;
            const td = a.closest('td');

            if (!td) return;

            // 変数の中にURLが存在すればtdタグにクラスを付与
            if (validUrls.has(href)) {
                td.classList.add('fvt-viewed');
            } else {
                td.classList.remove('fvt-viewed');
            }
        });
    }

    // ==========================================
    // イベント監視 (動的更新への対応)
    // ==========================================

    // スクリプト読み込み時の初回実行
    updateHighlights();

    // [別タブ] でローカルストレージが更新された場合の検知
    // windowのstorageイベントは「他のウィンドウ/タブ」で更新があった時だけ発火します
    window.addEventListener('storage', (e) => {
        if (e.key === 'futaba_viewed_threads') {
            updateHighlights();
        }
    });

    // [同じタブ] でローカルストレージが更新された場合の検知
    // 同じタブ内の操作ではstorageイベントが起きないため、setItem関数を乗っ取ります(フック)
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        // 本来の保存処理を実行
        const result = originalSetItem.apply(this, arguments);

        // もし監視対象のキーなら、画面更新を実行
        if (key === 'futaba_viewed_threads') {
            updateHighlights();
        }
        return result;
    };

    // リンクをクリックした瞬間に変数へ追加します
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href) {
            // 指定のURL形式で始まっているか判定
            if (link.href.startsWith(TARGET_URL_PREFIX)) {
                // ストレージ二追加
                saveClickedUrl(link.href);
                // 即座に画面に反映 (クリックしたその要素を塗るため)
                updateHighlights();
            }
        }
    });

    // DOMの変更監視
    // 新しいtd要素が画面に追加された時用
    const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;

        // 追加された要素(addedNodes)があるかチェック
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                shouldUpdate = true;
            }
        });

        // 何かが追加されていれば再判定を実行
        if (shouldUpdate) {
            updateHighlights();
        }
    });

    // body以下の全ての変更を監視開始
    observer.observe(document.body, { childList: true, subtree: true });

})();