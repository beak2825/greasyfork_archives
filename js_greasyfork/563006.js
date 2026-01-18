// ==UserScript==
// @name          Open2ch NG Fix
// @namespace     https://greasyfork.org/ja/users/864059
// @version       2.0
// @description   サーバー移転後自動新着でNGが効いていないのを修正（CSS強制上書き）
// @author        七色の彩り
// @match         https://*.open2ch.net/test/read.cgi/*
// @icon          https://open2ch.net/favicon.ico
// @run-at        document-start
// @grant         none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/563006/Open2ch%20NG%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/563006/Open2ch%20NG%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const match = location.pathname.match(/\/([^\/]+)\/\d+/);
    if (!match) return;
    const storageKey = 'ignv4' + match[1];

    // CSSを管理するためのstyle要素
    let styleEl = null;

    // NG IDリストを元に、非表示用のCSSを生成して適用する
    const updateNGStyle = () => {
        const ignoreListRaw = localStorage.getItem(storageKey);
        if (!ignoreListRaw) return;

        const ignoreList = ignoreListRaw.split('<D>').filter(id => id);
        if (ignoreList.length === 0) {
            if (styleEl) styleEl.textContent = '';
            return;
        }

        // 各IDに対して「display: none !important」を強制するCSSを作成
        // 例: dl[uid="ID"] { display: none !important; }
        const cssRules = ignoreList.map(id => `dl[uid="${id}"] { display: none !important; }`).join('\n');

        if (!styleEl) {
            styleEl = document.createElement('style');
            document.head ? document.head.appendChild(styleEl) : document.documentElement.appendChild(styleEl);
        }
        styleEl.textContent = cssRules;
    };

    // 初回実行
    updateNGStyle();

    // ユーザーがNG登録（赤の×ボタンクリック）した時にCSSを更新する
    document.addEventListener('click', (e) => {
        if (e.target.closest('.iok')) {
            setTimeout(updateNGStyle, 100);
        }
    }, true);

    // 念のため、新着が来たタイミングでもリストが更新されていないかチェック
    // (別のタブでNG登録した場合などへの対策)
    const observer = new MutationObserver(() => {
        updateNGStyle();
    });

    window.addEventListener('DOMContentLoaded', () => {
        const target = document.getElementById('res_field') || document.body;
        observer.observe(target, { childList: true });
        updateNGStyle();
    });

})();