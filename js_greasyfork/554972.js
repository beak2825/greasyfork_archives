// ==UserScript==
// @name         [Niko] ニコニコ広場 非表示
// @namespace    http://tampermonkey.net/
// @version      2025/11/06/1
// @description  おすすめ動画欄のニコニコ広場を非表示にする
// @match        https://www.nicovideo.jp/watch/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554972/%5BNiko%5D%20%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%BA%83%E5%A0%B4%20%E9%9D%9E%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/554972/%5BNiko%5D%20%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%BA%83%E5%A0%B4%20%E9%9D%9E%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideHiroba(hiroba_button) {
        // ボタンの親を2階層辿ると広場全体のdivに到達
        let container = hiroba_button.closest('div.d_flex.flex-d_column');
        if (container) {
            container.style.display = "none";
            console.log("広場要素を非表示にしました");
        }
    }

    // 初期チェック（既にある場合）
    const initialButton = document.querySelector('button[data-element-name="hiroba_navigation"]');
    if (initialButton) hideHiroba(initialButton);

    // DOM変化を監視
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (!(node instanceof HTMLElement)) continue;

                // 追加された要素内に広場ボタンがあるか確認
                const button = node.querySelector?.('button[data-element-name="hiroba_navigation"]');
                if (button) hideHiroba(button);
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
