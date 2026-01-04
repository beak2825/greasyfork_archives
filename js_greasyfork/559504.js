// ==UserScript==
// @name         あいもげ書き込み開きちゃん
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  ファイルをドラッグしながらホバーした時に書き込み欄を開く
// @author       doridoridorin
// @match        https://nijiurachan.net/pc/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559504/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E6%9B%B8%E3%81%8D%E8%BE%BC%E3%81%BF%E9%96%8B%E3%81%8D%E3%81%A1%E3%82%83%E3%82%93.user.js
// @updateURL https://update.greasyfork.org/scripts/559504/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E6%9B%B8%E3%81%8D%E8%BE%BC%E3%81%BF%E9%96%8B%E3%81%8D%E3%81%A1%E3%82%83%E3%82%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ドラッグイベントを設定する関数
    function setupDragHover() {
        // 対象のクラスを持つ要素を取得
        const targets = document.querySelectorAll('.thread-form-tab, .reply-form-tab');

        targets.forEach(el => {
            // 既にイベント設定済みならスキップ（多重登録防止）
            if (el.dataset.dragHoverInitialized) return;

            // フラグを立てる
            el.dataset.dragHoverInitialized = 'true';

            // ドラッグ状態で要素に入った時のイベント
            el.addEventListener('dragenter', (e) => {
                // ファイルをドラッグしている場合のみ実行
                // dataTransfer.typesに'Files'が含まれているかチェック
                if (e.dataTransfer && e.dataTransfer.types.includes('Files')) {
                    // 親要素が存在し、かつ 'collapsed' クラスを持っているか確認
                    if (el.parentElement && el.parentElement.classList.contains('collapsed')) {
                        e.preventDefault();
                        // クリックイベントを発火させる
                        el.click();

                    }
                }
            });

            // ドラッグオーバー中もドロップを許可する視覚効果のために必要
            el.addEventListener('dragover', (e) => {
                if (e.dataTransfer && e.dataTransfer.types.includes('Files')) {
                    e.preventDefault();
                }
            });
        });
    }

    // 初回実行
    setupDragHover();

    // 動的監視
    const observer = new MutationObserver((mutations) => {
        // DOMに変更があったら再スキャンして未設定の要素にイベントを付与
        setupDragHover();
    });

    // body以下の変更を監視開始
    observer.observe(document.body, { childList: true, subtree: true });

})();