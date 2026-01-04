// ==UserScript==
// @name         AI Studio Disclaimer Remover
// @namespace    https://rentry.co/v43zkori/
// @license      MIT
// @version      1.0
// @description  AI Studioの「間違うことがあります」免責事項メッセージを削除します
// @author       ForeverPWA
// @match        *://aistudio.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559548/AI%20Studio%20Disclaimer%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/559548/AI%20Studio%20Disclaimer%20Remover.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const LOG_PREFIX = "🗑️ AI Studio Disclaimer Remover:";
    console.log(LOG_PREFIX, "Script started.");

    /**
     * 免責事項の要素を削除する
     */
    function removeDisclaimer() {
        const disclaimers = document.querySelectorAll('ms-hallucinations-disclaimer');
        disclaimers.forEach(el => {
            console.log(LOG_PREFIX, "Removing disclaimer element");
            el.remove();
        });
    }

    // 初回実行
    removeDisclaimer();

    // DOM変更を監視して新しく追加された要素も削除
    const observer = new MutationObserver(() => {
        removeDisclaimer();
    });

    console.log(LOG_PREFIX, "Observing DOM changes...");
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();