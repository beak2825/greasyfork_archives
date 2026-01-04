// ==UserScript==
// @name         Disable Google Ai OverView
// @namespace    http://tampermonkey.net/
// @version      2025-10-04-2
// @description  Google検索で表示されるAI概要を抑制・削除します。
//               方法: 
//                 1. data-subtree="mfc,mfl" のDOMを非表示＆削除
//                 2. URLを https://www.google.com/search?udm=14&q=キーワード に書き換え
//                    （動作保証はなく環境依存）
// @author       Ruku
// @match        https://www.google.com/search*
// @match        http://www.google.com/search*
// @grant        none
// @run-at       document-start
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551460/Disable%20Google%20Ai%20OverView.user.js
// @updateURL https://update.greasyfork.org/scripts/551460/Disable%20Google%20Ai%20OverView.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- ① URL書き換え (udm=14 がなければ追加してリロード) ---
    (function enforceUDM14() {
        const url = new URL(window.location.href);
        if (url.hostname === "www.google.com" && url.pathname === "/search") {
            if (!url.searchParams.has("udm")) {
                url.searchParams.set("udm", "14");
                window.location.replace(url.toString());
            }
        }
    })();

    // --- ② CSSで初期から非表示にする ---
    const style = document.createElement('style');
    style.textContent = '[data-subtree="mfc,mfl"] { display: none !important; }';
    document.documentElement.appendChild(style);

    // --- ③ MutationObserverで追加ノードを監視し削除 ---
    new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.nodeType === 1) {
                    if (node.matches?.('[data-subtree="mfc,mfl"]')) {
                        node.remove();
                    }
                    node.querySelectorAll?.('[data-subtree="mfc,mfl"]').forEach(el => el.remove());
                }
            }
        }
    }).observe(document, { childList: true, subtree: true });

})();
