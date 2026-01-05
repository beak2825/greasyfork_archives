// ==UserScript==
// @name         Tribox Contest Scramble Copier
// @namespace    https://greasyfork.org/ja/users/1556148
// @license      MIT
// @version      2026.01.04.6
// @description  Tribox Contestのスクランブルをコピーするボタンを左側に配置
// @author       nattyu3
// @match        https://contest.tribox.com/contest/*/form
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tribox.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561430/Tribox%20Contest%20Scramble%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/561430/Tribox%20Contest%20Scramble%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Tribox Copier v3: Script Start');

    // 1. まずテーブル枠組みが見つかるまで待つ
    const waitTable = setInterval(() => {
        const table = document.getElementById('contest-scrambles');
        if (table) {
            console.log('Tribox Copier v3: Table container found. Starting Observer.');
            clearInterval(waitTable);

            // 2. テーブルが見つかったら、その中身を監視開始
            startObserving(table);
        }
    }, 500);

    function startObserving(table) {
        // 初回実行（もし既に中身がある場合のため）
        processRows(table);

        // 監視カメラの設置 (MutationObserver)
        // テーブルの中身(tbody)に変更があったら processRows を再実行する設定
        const observer = new MutationObserver(() => {
            processRows(table);
        });

        // 監視開始
        // childList: true -> 子要素の追加・削除を監視
        // subtree: true -> 孫要素まで監視
        observer.observe(table, { childList: true, subtree: true });
    }

    function processRows(table) {
        const rows = table.querySelectorAll('tbody tr');

        // デバッグ用：何行見えているかログに出す
        if (rows.length > 0) {
            console.log(`Tribox Copier v3: Found ${rows.length} rows`);
        }

        rows.forEach(row => {
            // 安全策：セルが足りない行は無視
            if (row.cells.length < 2) return;

            const labelCell = row.cells[0];

            // 【重要】重複防止チェック
            // 既にボタンを追加済みの行なら何もしないでスキップ
            if (labelCell.querySelector('.tribox-copy-btn')) return;

            const scrambleCell = row.cells[1];
            const scrambleText = scrambleCell.innerText.trim();

            // ボタン作成
            const btn = document.createElement('button');
            btn.className = 'tribox-copy-btn'; // 重複チェック用の目印クラス
            btn.innerText = '📋';
            btn.title = 'Copy Scramble';

            Object.assign(btn.style, {
                marginRight: '8px',
                padding: '2px 6px',
                fontSize: '12px',
                cursor: 'pointer',
                backgroundColor: '#eee',
                border: '1px solid #ccc',
                borderRadius: '4px',
                verticalAlign: 'middle'
            });

            btn.onclick = (e) => {
                e.stopPropagation(); // 行クリック等の暴発防止
                navigator.clipboard.writeText(scrambleText).then(() => {
                    const originalText = btn.innerText;
                    btn.innerText = '✅';
                    btn.style.backgroundColor = '#dff0d8';
                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.style.backgroundColor = '#eee';
                    }, 1000);
                }).catch(err => console.error(err));
            };

            // ラベルセルの先頭に挿入
            labelCell.insertBefore(btn, labelCell.firstChild);
        });
    }
})();
