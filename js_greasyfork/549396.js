// ==UserScript==
// @name         Disable Google AI Search & Hide Button (for AtCoder)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Redirects Google AI search (udm=50) and hides the "AI Mode" button from the UI to comply with AtCoder rules.
// @description:ja AtCoderのルールに準拠するため、GoogleのAI検索(udm=50)をリダイレクトし、UIから「AI モード」ボタンを非表示にします。
// @author       paruma184
// @license      MIT
// @match        *://www.google.com/search*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/549396/Disable%20Google%20AI%20Search%20%20Hide%20Button%20%28for%20AtCoder%29.user.js
// @updateURL https://update.greasyfork.org/scripts/549396/Disable%20Google%20AI%20Search%20%20Hide%20Button%20%28for%20AtCoder%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 機能1: AIモードのページを開いてしまった場合にリダイレクトする ---
    // この処理はページの読み込み開始時に即座に実行される
    if (window.location.href.includes('udm=50')) {
        const newUrl = window.location.href.replace('udm=50', 'udm=14');
        window.location.replace(newUrl);
        return; // リダイレクト後は以降の処理不要
    }

    // --- 機能2: 検索メニューから「AI モード」のボタンを非表示にする ---
    // ページのDOMが読み込まれた後、CSSを追加してボタンを消す
    // @grant GM_addStyle がこの機能のために必要
    const css = `
        /* hrefに "udm=50" を含むリンクを持つメニュー項目を非表示にする */
        div[role="listitem"]:has(a[href*="udm=50"]) {
            display: none !important;
        }
    `;

    // ページが読み込まれるのを待ってからCSSを適用
    // Tampermonkeyの機能であるGM_addStyleを使ってCSSを注入
    GM_addStyle(css);

})();