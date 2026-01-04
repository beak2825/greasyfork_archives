// ==UserScript==
// @name         Yahooニュース 通報リンクを完全一致で30pxレインボー
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  「記事に関する報告」だけを正確に30pxレインボーに
// @author       Grok
// @match        https://news.yahoo.co.jp/articles/*
// @match        https://news.yahoo.co.jp/pickup/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556999/Yahoo%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9%20%E9%80%9A%E5%A0%B1%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%92%E5%AE%8C%E5%85%A8%E4%B8%80%E8%87%B4%E3%81%A730px%E3%83%AC%E3%82%A4%E3%83%B3%E3%83%9C%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/556999/Yahoo%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9%20%E9%80%9A%E5%A0%B1%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%92%E5%AE%8C%E5%85%A8%E4%B8%80%E8%87%B4%E3%81%A730px%E3%83%AC%E3%82%A4%E3%83%B3%E3%83%9C%E3%83%BC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // レインボーCSS（背景クリップで綺麗な虹色文字）
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        .yahoo-report-perfect-rainbow {
            font-size: 30px !important;
            font-weight: 900 !important;
            background: linear-gradient(90deg, #ff0000, #ff9900, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff) !important;
            background-size: 300% 300% !important;
            -webkit-background-clip: text !important;
            background-clip: text !important;
            color: transparent !important;
            animation: rainbow 4s ease-in-out infinite !important;
            text-shadow: 0 0 8px rgba(255,255,255,0.9) !important;
            display: inline-block !important;
            padding: 4px 8px !important;
            border-radius: 6px !important;
            transform: scale(1.05);
        }
    `;
    document.head.appendChild(style);

    const TARGET_TEXT = '記事に関する報告';

    function applyPerfectRainbow() {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        const targets = [];

        while (node = walker.nextNode()) {
            if (node.textContent.trim() === TARGET_TEXT) {
                // 親がaかbuttonかspanならそこを対象にする
                let parent = node.parentElement;
                while (parent && parent !== document.body) {
                    if (parent.tagName === 'A' || parent.tagName === 'BUTTON' || parent.tagName === 'SPAN') {
                        if (!parent.classList.contains('yahoo-report-perfect-rainbow')) {
                            targets.push(parent);
                        }
                        break;
                    }
                    parent = parent.parentElement;
                }
            }
        }

        targets.forEach(el => {
            el.classList.add('yahoo-report-perfect-rainbow');
            console.log('完全一致でレインボー適用 →', el);
        });
    }

    // 初回実行
    setTimeout(applyPerfectRainbow, 1500);

    // ページ読み込み後も定期チェック（Yahooは遅延読み込み多い）
    setInterval(applyPerfectRainbow, 3000);

    // SPA遷移対応
    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(applyPerfectRainbow, 1200);
        }
    }).observe(document.body, { childList: true, subtree: true });
})();