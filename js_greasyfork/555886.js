// ==UserScript==
// @name         Auto Popup Killer BOOK☆WALKER
// @namespace    https://bookwalker.jp/
// @version      1.0
// @description  BOOK☆WALKER のポップアップを自動で閉じる
// @match        https://bookwalker.jp/*
// @match        https://*.bookwalker.jp/*
// @run-at       document-idle
// @grant        none
// @namespace    shino-tools
// @license CC0-1.0
// @downloadURL https://update.greasyfork.org/scripts/555886/Auto%20Popup%20Killer%20BOOK%E2%98%86WALKER.user.js
// @updateURL https://update.greasyfork.org/scripts/555886/Auto%20Popup%20Killer%20BOOK%E2%98%86WALKER.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 「閉じる」ボタンらしい要素のセレクタ候補（必要に応じて足せます）
    const CLOSE_SELECTORS = [
        // よくあるモーダル系のクローズボタン
        '.js-modal-close',
        '.js-popup-close',
        '.c-modal__close',
        '.m-modal__close',
        '.p-modal__close',
        '.a-modal__close',
        '.c-popup__close',
        'button[aria-label="閉じる"]',
        'button[aria-label="Close"]',
        'button[aria-label="close"]',

        // × ボタン系
        'button[title="閉じる"]',
        'button[title="close"]',
        'button.close',
        '.c-btn--close',
        '.js-close',

        // BOOK☆WALKER 固有っぽいものを想定（効かなければ削除して構いません）
        '.js-ma-popup-close-button',
        '.js-ma-popup-close'
    ];

    // テキストで判定して閉じるボタンを探すときに使うキーワード
    const CLOSE_TEXTS = [
        '閉じる',
        'とじる',
        'CLOSE',
        'Close',
        '閉じる×',
        '今は表示しない',
        '二度と表示しない',
        'スキップ',
        'Skip'
    ];

    // 要素が画面上で見えているかをゆるく判定
    function isVisible(el) {
        if (!el) return false;
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
            return false;
        }
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
    }

    // セレクタで見つかったクローズボタンをクリック
    function clickBySelectors(root = document) {
        let closed = 0;
        for (const sel of CLOSE_SELECTORS) {
            const nodes = root.querySelectorAll(sel);
            for (const node of nodes) {
                if (!isVisible(node)) continue;
                try {
                    node.click();
                    closed++;
                } catch (e) {
                    // 無視
                }
            }
        }
        return closed;
    }

    // ボタンやリンクのテキストを見て「閉じる」系をクリック
    function clickByText(root = document) {
        let closed = 0;
        const candidates = root.querySelectorAll('button, a, span, div');
        for (const el of candidates) {
            if (!isVisible(el)) continue;
            const text = (el.innerText || '').trim();
            if (!text) continue;
            if (CLOSE_TEXTS.some(t => text === t || text.startsWith(t) || text.endsWith(t))) {
                try {
                    el.click();
                    closed++;
                } catch (e) {
                    // 無視
                }
            }
        }
        return closed;
    }

    // 実際にポップアップを探して閉じる処理
    function closePopups() {
        let closed = 0;

        // まずは明示的なクラスなど
        closed += clickBySelectors();

        // まだ残っていそうならテキストベースで探索
        if (closed === 0) {
            closed += clickByText();
        }

        if (closed > 0) {
            console.log('[BOOK☆WALKER Auto Close Popups] closed:', closed);
        }
    }

    // ページ読み込み時に一度
    window.addEventListener('load', () => {
        closePopups();
    });

    // しばらくの間は定期的にチェック（表示が遅れて出るポップアップ用）
    let counter = 0;
    const intervalId = setInterval(() => {
        closePopups();
        counter++;
        // 60 回（約 1 分）動かしたら停止。必要なら数字を増やしてください。
        if (counter > 60) clearInterval(intervalId);
    }, 1000);

    // MutationObserver で DOM 変化を監視して、何か出てきたら閉じる
    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.addedNodes && m.addedNodes.length > 0) {
                // 追加されたノードの中だけ軽く見る
                for (const node of m.addedNodes) {
                    if (!(node instanceof HTMLElement)) continue;
                    // ポップアップっぽいダイアログ要素を優先して閉じる
                    const dialogRoot = node.matches('div[role="dialog"], [aria-modal="true"]') ? node : node;
                    const closed = clickBySelectors(dialogRoot) + clickByText(dialogRoot);
                    if (closed > 0) {
                        console.log('[BOOK☆WALKER Auto Close Popups] closed via MutationObserver:', closed);
                    }
                }
            }
        }
    });

    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    } else {
        // 念のため body がまだ無いケースにも対応
        window.addEventListener('DOMContentLoaded', () => {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
})();
