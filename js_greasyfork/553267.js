// ==UserScript==
// @name         Halloween-AtCoder
// @namespace    https://github.com/minoru-kinugasa-105/halloween_atcoder_extension
// @version      1.0
// @description  AtCoderのWAやTLEの表示をハロウィン仕様に変え、かぼちゃマークで装飾する拡張機能
// @author       minoru-kinugasa-105
// @match        https://atcoder.jp/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553267/Halloween-AtCoder.user.js
// @updateURL https://update.greasyfork.org/scripts/553267/Halloween-AtCoder.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ハロウィン仕様のCSSスタイルを追加
    function addHalloweenStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* WAとTLEのハロウィン装飾 */
            .halloween-wa {
                background: linear-gradient(45deg, #ff6b35, #f7931e) !important;
                color: #fff !important;
                border: 3px solid #ce6317 !important;
                border-radius: 15px !important;
                padding: 6px 10px !important;
                font-weight: bold !important;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5) !important;
                box-shadow: 0 0 20px rgba(255, 107, 53, 0.6) !important;
                animation: halloweenGlow 2s ease-in-out infinite alternate !important;
                position: relative !important;
            }

            .halloween-tle {
                background: linear-gradient(45deg, #8b0000, #ff4500) !important;
                color: #fff !important;
                border: 3px solid #ad0000 !important;
                border-radius: 15px !important;
                padding: 6px 10px !important;
                font-weight: bold !important;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5) !important;
                box-shadow: 0 0 20px rgba(255, 69, 0, 0.6) !important;
                animation: halloweenGlow 2s ease-in-out infinite alternate !important;
                position: relative !important;
            }

            .halloween-mle {
                background: linear-gradient(45deg, #4b0082, #8a2be2) !important;
                color: #fff !important;
                border: 3px solid #2f0047 !important;
                border-radius: 15px !important;
                padding: 6px 10px !important;
                font-weight: bold !important;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5) !important;
                box-shadow: 0 0 20px rgba(138, 43, 226, 0.6) !important;
                animation: halloweenGlow 2s ease-in-out infinite alternate !important;
                position: relative !important;
            }

            .halloween-re {
                background: linear-gradient(45deg, #dc143c, #ff6347) !important;
                color: #fff !important;
                border: 3px solid #8b0000 !important;
                border-radius: 15px !important;
                padding: 6px 10px !important;
                font-weight: bold !important;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5) !important;
                box-shadow: 0 0 20px rgba(220, 20, 60, 0.6) !important;
                animation: halloweenGlow 2s ease-in-out infinite alternate !important;
                position: relative !important;
            }

            .halloween-ce {
                background: linear-gradient(45deg, #2f4f4f, #708090) !important;
                color: #fff !important;
                border: 3px solid #393939 !important;
                border-radius: 15px !important;
                padding: 6px 10px !important;
                font-weight: bold !important;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5) !important;
                box-shadow: 0 0 20px rgba(112, 128, 144, 0.6) !important;
                animation: halloweenGlow 2s ease-in-out infinite alternate !important;
                position: relative !important;
            }

            .halloween-ac {
                background: linear-gradient(45deg, #228b22, #32cd32) !important;
                color: #fff !important;
                border: 3px solid #008b00 !important;
                border-radius: 15px !important;
                padding: 6px 10px !important;
                font-weight: bold !important;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5) !important;
                box-shadow: 0 0 20px rgba(34, 139, 34, 0.6) !important;
                animation: halloweenGlow 2s ease-in-out infinite alternate !important;
                position: relative !important;
            }

            /* かぼちゃマーク */
            .halloween-pumpkin::before {
                content: "🎃" !important;
                font-size: 1.2em !important;
                margin-right: 8px !important;
                animation: pumpkinBounce 1.5s ease-in-out infinite !important;
            }

            /* AC用の成功マーク */
            .halloween-ac::before {
                content: "🍭" !important;
                font-size: 1.2em !important;
                margin-right: 8px !important;
                animation: candyBounce 1.5s ease-in-out infinite !important;
            }

            /* アニメーション効果 */
            @keyframes halloweenGlow {
                0% { box-shadow: 0 0 20px rgba(255, 107, 53, 0.6); }
                100% { box-shadow: 0 0 30px rgba(255, 107, 53, 0.9), 0 0 40px rgba(255, 107, 53, 0.4); }
            }

            @keyframes pumpkinBounce {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-3px) rotate(5deg); }
            }

            @keyframes candyBounce {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-3px) rotate(10deg); }
            }

            /* ホバー効果（ガクガクを防ぐため削除） */

            /* スパイダーウェブ装飾 */
            .halloween-wa::after, .halloween-tle::after, .halloween-mle::after, .halloween-re::after, .halloween-ce::after {
                content: "🕷️" !important;
                position: absolute !important;
                top: -5px !important;
                right: -5px !important;
                font-size: 0.8em !important;
                animation: spiderWeb 3s ease-in-out infinite !important;
            }

            /* AC用の成功装飾 */
            .halloween-ac::after {
                content: "👻" !important;
                position: absolute !important;
                top: -5px !important;
                right: -5px !important;
                font-size: 0.8em !important;
                animation: ghostFloat 2s ease-in-out infinite !important;
            }

            @keyframes ghostFloat {
                0%, 100% { opacity: 0.8; transform: translateY(0px) rotate(0deg); }
                50% { opacity: 1; transform: translateY(-3px) rotate(5deg); }
            }

            @keyframes spiderWeb {
                0%, 100% { opacity: 0.7; transform: rotate(0deg); }
                50% { opacity: 1; transform: rotate(180deg); }
            }

            /* ハロウィン装飾された要素の親tr要素の高さ調整 */
            tr:has(.halloween-wa), tr:has(.halloween-tle), tr:has(.halloween-mle), tr:has(.halloween-re), tr:has(.halloween-ce), tr:has(.halloween-ac) {
                height: 33px !important;
                min-height: 33px !important;
            }

            /* td要素内でハロウィン装飾されたステータスを垂直中央寄せ */
            tr:has(.halloween-wa) td, tr:has(.halloween-tle) td, tr:has(.halloween-mle) td, tr:has(.halloween-re) td, tr:has(.halloween-ce) td, tr:has(.halloween-ac) td {
                vertical-align: middle !important;
                display: table-cell !important;
            }

            /* ハロウィン装飾の小要素のはみ出し防止 */
            .halloween-wa, .halloween-tle, .halloween-mle, .halloween-re, .halloween-ce, .halloween-ac {
                overflow: visible !important;
                position: relative !important;
                vertical-align: middle !important;
                display: inline-block !important;
            }

            /* かぼちゃマークのサイズ調整 */
            .halloween-pumpkin::before {
                font-size: 1.1em !important;
                margin-right: 6px !important;
            }

            /* クモのサイズ調整 */
            .halloween-wa::after, .halloween-tle::after, .halloween-mle::after, .halloween-re::after, .halloween-ce::after {
                font-size: 0.7em !important;
                top: -5px !important;
                right: -5px !important;
            }
        `;
        document.head.appendChild(style);
    }

    // ジャッジ結果の要素のみを検出して装飾を適用
    function applyHalloweenDecoration() {
        // まず、既に装飾済みの要素を除外
        const decoratedElements = document.querySelectorAll('.halloween-wa, .halloween-tle, .halloween-mle, .halloween-re, .halloween-ce, .halloween-ac');
        decoratedElements.forEach(element => {
            element.classList.remove('halloween-wa', 'halloween-tle', 'halloween-mle', 'halloween-re', 'halloween-ce', 'halloween-ac', 'halloween-pumpkin');
        });

        // ジャッジ結果のステータス要素のみを検索
        const statusElements = document.querySelectorAll('span.label.label-warning, span.label.label-success');

        statusElements.forEach(element => {
            const text = element.textContent.trim().toUpperCase();

            // ステータスラベルのみを対象にする
            if (text === 'WA') {
                element.classList.add('halloween-wa', 'halloween-pumpkin');
            } else if (text === 'TLE') {
                element.classList.add('halloween-tle', 'halloween-pumpkin');
            } else if (text === 'MLE') {
                element.classList.add('halloween-mle', 'halloween-pumpkin');
            } else if (text === 'RE') {
                element.classList.add('halloween-re', 'halloween-pumpkin');
            } else if (text === 'CE') {
                element.classList.add('halloween-ce', 'halloween-pumpkin');
            } else if (text === 'AC') {
                element.classList.add('halloween-ac');
            }
        });
    }

    // ページの変更を監視して動的に装飾を適用
    function observePageChanges() {
        const observer = new MutationObserver(function (mutations) {
            let shouldUpdate = false;
            mutations.forEach(function (mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldUpdate = true;
                }
            });

            if (shouldUpdate) {
                setTimeout(applyHalloweenDecoration, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 初期化
    function init() {
        addHalloweenStyles();
        applyHalloweenDecoration();
        observePageChanges();

        // ページロード完了後に再実行
        window.addEventListener('load', function () {
            setTimeout(applyHalloweenDecoration, 500);
        });
    }

    // DOMが準備できたら実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();