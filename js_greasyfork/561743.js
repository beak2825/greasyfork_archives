// ==UserScript==
// @name         2game.info Day0コメント非表示
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  rimworld.2game.infoでDay0ユーザーのコメントを非表示にする
// @author       ranran
// @match        https://rimworld.2game.info/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/561743/2gameinfo%20Day0%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E9%9D%9E%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/561743/2gameinfo%20Day0%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E9%9D%9E%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Day0コメントを非表示にする
     */
    function hideDay0Comments() {
        // 全てのコメント行を取得（サイドバーとメインページ両方）
        // サイドバー: <tr>（クラスなし）、メインページ: <tr class="n">
        const commentRows = document.querySelectorAll('table.commentTable tr');
        let hiddenCount = 0;

        commentRows.forEach(row => {
            const idSpan = row.querySelector('span.cmId');
            if (idSpan) {
                // "Day:0" または "Day: 0" のパターンをチェック
                // <span class="white">0</span> の場合も考慮
                const text = idSpan.textContent;
                if (/Day:\s*0(?:\s|$)/.test(text)) {
                    row.style.display = 'none';
                    hiddenCount++;
                }
            }
        });

        if (hiddenCount > 0) {
            console.log(`[Day0非表示] ${hiddenCount}件のDay0コメントを非表示にしました`);
        }
    }

    // 初回実行
    hideDay0Comments();

    // DOMの変更を監視（動的に読み込まれるコメント対応）
    const observer = new MutationObserver((mutations) => {
        let shouldCheck = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                shouldCheck = true;
                break;
            }
        }
        if (shouldCheck) {
            hideDay0Comments();
        }
    });

    // body全体を監視（サイドバーとメインコメント両方）
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('[Day0非表示] スクリプトが有効化されました');
})();
