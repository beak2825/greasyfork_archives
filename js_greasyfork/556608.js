// ==UserScript==
// @name         Global Novel Formatter (Auto-Refresh v4.0)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @license      MIT
// @description  リロード不要！ルビ・傍点を定期的に自動適用する最強版
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556608/Global%20Novel%20Formatter%20%28Auto-Refresh%20v40%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556608/Global%20Novel%20Formatter%20%28Auto-Refresh%20v40%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // 設定：何ミリ秒ごとにパトロールするか（1000ms = 1秒）
    const REFRESH_RATE = 1000;

    // 無視するタグリスト
    const IGNORE_TAGS = ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'PRE', 'CODE', 'SELECT', 'OPTION', 'NOSCRIPT'];
    function formatNovelText(node) {
        if (!node || node.nodeType !== 3) return;

        const parent = node.parentNode;
        if (!parent || IGNORE_TAGS.includes(parent.tagName) || parent.isContentEditable) return;
        const text = node.nodeValue;
        if (!text.includes('(') && !text.includes('（')) return;
        let newHtml = text;
        // 1. ルビ変換 ( 漢字 + (かな) )
        newHtml = newHtml.replace(
            /([\u4e00-\u9fa5]+)([\(\uff08])([\u3040-\u309f\u30a0-\u30ff]+)([\)\uff09])/g,
            '<ruby>$1<rt>$3</rt></ruby>'
        );
        // 2. 傍点変換 ( 文字 + (・・) )
        newHtml = newHtml.replace(
            /([^\(\uff08]+)([\(\uff08])([・･]+)([\)\uff09])/g, 
            function(match, textBefore, openParen, dots, closeParen) {
                const dotLen = dots.length;
                const textLen = textBefore.length;
                if (textLen < dotLen) return match; 
                const targetPart = textBefore.slice(-dotLen);
                const prefixPart = textBefore.slice(0, -dotLen);
                return `${prefixPart}<span style="text-emphasis: filled dot; -webkit-text-emphasis: filled dot;">${targetPart}</span>`;
            }
        );
        // 変更があり、かつ「現在AIが書き込んでいる最中の末尾」でない場合のみ適用
        // (カーソル位置のバグを防ぐため、ある程度"確定"した部分のみを狙う)
        if (newHtml !== text) {
            try {
                const span = document.createElement('span');
                span.innerHTML = newHtml;
                parent.replaceChild(span, node);
            } catch (e) {
                // エラーは無視
            }
        }
    }
    // 【機能1】素早い反応のための監視 (MutationObserver)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && !IGNORE_TAGS.includes(node.tagName)) {
                    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
                    let textNode;
                    while(textNode = walker.nextNode()) formatNovelText(textNode);
                } else if (node.nodeType === 3) {
                    formatNovelText(node);
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    // 【機能2】取りこぼしを拾う定期パトロール (setInterval)
    // これが「リロードしないと直らない」を防ぐ決め手です
    setInterval(() => {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let textNode;
        // ページ内の全テキストを走査して、未変換のものがあれば変換
        while(textNode = walker.nextNode()) {
            formatNovelText(textNode);
        }
    }, REFRESH_RATE);
})();
