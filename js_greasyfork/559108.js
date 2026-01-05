// ==UserScript==
// @name         Google AIstudio タブ名自動変更
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Google AI Studioのタブ名を自動的にチャットタイトルに変更します
// @author       yofumin
// @license      MIT
// @match        https://aistudio.google.com/*
// @icon         data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="93" font-size="120" text-anchor="middle">🔄</text><text x="68" y="86" font-size="63" text-anchor="middle">✒️</text></svg>
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/559108/Google%20AIstudio%20%E3%82%BF%E3%83%96%E5%90%8D%E8%87%AA%E5%8B%95%E5%A4%89%E6%9B%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/559108/Google%20AIstudio%20%E3%82%BF%E3%83%96%E5%90%8D%E8%87%AA%E5%8B%95%E5%A4%89%E6%9B%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 監視するターゲット（デザイン変更でクラス名が変わったらここを修正）
    const TARGET_SELECTOR = 'h1.mode-title';

    /**
     * タイトルを更新する関数
     */
    function updateTitle() {
        const titleEl = document.querySelector(TARGET_SELECTOR);
        if (!titleEl) return;

        const text = titleEl.textContent.trim();
        const currentTitle = document.title;

        // 除外したい初期タイトルリスト（必要に応じて追加）
        const ignoreTitles = [
            "Playground",
            "Untitled Prompt",
            "Untitled",
            "無題のプロンプト",
            "Prompt"
        ];

        // 1. テキストが空でない
        // 2. 除外リストに含まれていない
        // 3. 現在のタブ名と違う
        // 場合のみ更新を実行
        if (text && !ignoreTitles.includes(text) && currentTitle !== text) {
            document.title = text;
            // console.log("Tab Renamer: Updated to", text);
        }
    }

    /**
     * メイン処理
     * Navigation APIが使える場合はイベント駆動（省エネ）、
     * 使えない場合はインターバル監視（互換性）に自動で切り替えます。
     */
    if (window.navigation) {
        // --- モダンブラウザ向け (Chrome, Edgeなど) ---
        // URL遷移時のみ動作する、待機コストゼロのイベント駆動モード
        navigation.addEventListener('navigatesuccess', () => {
            // URL変更直後はDOM描画待ちのため、数回リトライする
            setTimeout(updateTitle, 500);
            setTimeout(updateTitle, 1500);
            setTimeout(updateTitle, 5000);
        });

        // 初回ロード時用
        setTimeout(updateTitle, 1000);
        setTimeout(updateTitle, 10000);

    } else {
        // --- 互換モード (Firefox, Safariなど) ---
        // 従来通り1秒に1回チェックするモード
        setInterval(updateTitle, 1000);
    }

})();