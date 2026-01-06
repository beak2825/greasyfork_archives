// ==UserScript==
// @name         あいもげスレスクロール位置復元
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  スレ閲覧時のスクロール位置を記憶・復元します
// @author       Feldschlacht
// @match        https://nijiurachan.net/pc/thread*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561634/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E3%82%B9%E3%83%AC%E3%82%B9%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%AB%E4%BD%8D%E7%BD%AE%E5%BE%A9%E5%85%83.user.js
// @updateURL https://update.greasyfork.org/scripts/561634/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E3%82%B9%E3%83%AC%E3%82%B9%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%AB%E4%BD%8D%E7%BD%AE%E5%BE%A9%E5%85%83.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 設定 ---
    // 保存するキーの識別子
    const STORAGE_KEY_PREFIX = 'futaba_scroll_pos_';

    // 復元を試みる最大時間（ミリ秒）
    // lazy load画像が読み込まれてレイアウトが安定するまで、しつこく位置合わせを行います
    const RESTORE_TIMEOUT_MS = 3000;

    // データの有効期限（7日間）
    const EXPIRATION_DAYS = 7;
    const EXPIRATION_MS = EXPIRATION_DAYS * 24 * 60 * 60 * 1000;

    // --- スレッドIDの取得 ---
    function getThreadId() {
        // 1. フォーム内の hidden input から取得
        const restoInput = document.querySelector('input[name="resto"]');
        if (restoInput) return restoInput.value;

        // 2. URLから正規表現で抽出
        const match = location.href.match(/res\/(\d+)/) || location.href.match(/id=(\d+)/);
        return match ? match[1] : null;
    }

    const threadId = getThreadId();
    if (!threadId) return; // スレッドIDが特定できなければ何もしない

    const storageKey = STORAGE_KEY_PREFIX + threadId;

    // --- 保存ロジック (スクロール時) ---
    let isTicking = false;
    window.addEventListener('scroll', function() {
        if (!isTicking) {
            window.requestAnimationFrame(function() {
                // 最上部にいるときは誤保存防止のため保存しない
                if (window.scrollY > 0) {
                    // 位置情報と現在時刻(タイムスタンプ)をセットにして保存
                    const data = {
                        y: window.scrollY,
                        t: Date.now()
                    };
                    localStorage.setItem(storageKey, JSON.stringify(data));
                }
                isTicking = false;
            });
            isTicking = true;
        }
    }, { passive: true });

    // --- 復元ロジック (ロード時) ---
    const savedJson = localStorage.getItem(storageKey);

    if (savedJson !== null) {
        try {
            const data = JSON.parse(savedJson);

            // 古い形式（数値のみ）か、新しい形式（オブジェクト）か判定
            let targetY = 0;
            let timestamp = 0;

            if (typeof data === 'number') {
                // 古いデータ形式の場合（移行措置）
                targetY = data;
                timestamp = Date.now(); // 今のデータとみなす（次回保存時に形式更新）
            } else {
                // 新しいデータ形式の場合
                targetY = data.y;
                timestamp = data.t;
            }

            // 有効期限のチェック
            // 現在時刻 - 保存時刻 が 7日分(ミリ秒) を超えていたら
            if (Date.now() - timestamp > EXPIRATION_MS) {
                console.log('Scroll position expired. Removing data.');
                localStorage.removeItem(storageKey); // データを削除
                return; // 復元処理を中断
            }

            // 指定位置へスクロールさせる関数
            const restoreScroll = () => {
                if (Math.abs(window.scrollY - targetY) > 10) {
                    window.scrollTo(0, targetY);
                }
            };

            // 【戦略】タイミングを変えて何度か実行する
            restoreScroll();
            window.addEventListener('load', restoreScroll);

            // 画像読み込み待ち対策のインターバル実行
            const intervalId = setInterval(restoreScroll, 100);

            // --- 終了処理 ---
            setTimeout(() => {
                clearInterval(intervalId);
            }, RESTORE_TIMEOUT_MS);

            // ユーザー操作時のキャンセル処理
            const stopRestoring = () => {
                clearInterval(intervalId);
                window.removeEventListener('load', restoreScroll);
            };

            ['mousedown', 'wheel', 'touchstart', 'keydown'].forEach(evt => {
                window.addEventListener(evt, stopRestoring, { once: true, passive: true });
            });

        } catch (e) {
            console.error('JSON parse error:', e);
            // データが壊れている場合は削除しておく
            localStorage.removeItem(storageKey);
        }
    }

})();