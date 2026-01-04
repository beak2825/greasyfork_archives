// ==UserScript==
// @name         Amazonアソシエイトツールバー スリム化＋自動クリップボードコピー
// @version      1.0
// @description  アソシエイトツールバーを超スリム化＋リンク生成時に自動コピー
// @author       demupe3
// @match        https://www.amazon.co.jp/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-start
// @license MIT
// @namespace https://greasyfork.org/users/1544922
// @downloadURL https://update.greasyfork.org/scripts/558033/Amazon%E3%82%A2%E3%82%BD%E3%82%B7%E3%82%A8%E3%82%A4%E3%83%88%E3%83%84%E3%83%BC%E3%83%AB%E3%83%90%E3%83%BC%20%E3%82%B9%E3%83%AA%E3%83%A0%E5%8C%96%EF%BC%8B%E8%87%AA%E5%8B%95%E3%82%AF%E3%83%AA%E3%83%83%E3%83%97%E3%83%9C%E3%83%BC%E3%83%89%E3%82%B3%E3%83%94%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/558033/Amazon%E3%82%A2%E3%82%BD%E3%82%B7%E3%82%A8%E3%82%A4%E3%83%88%E3%83%84%E3%83%BC%E3%83%AB%E3%83%90%E3%83%BC%20%E3%82%B9%E3%83%AA%E3%83%A0%E5%8C%96%EF%BC%8B%E8%87%AA%E5%8B%95%E3%82%AF%E3%83%AA%E3%83%83%E3%83%97%E3%83%9C%E3%83%BC%E3%83%89%E3%82%B3%E3%83%94%E3%83%BC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ツールバースリム化CSS
    GM_addStyle(`
        #amzn-ss-wrap, .amzn-ss-wrap {
            height: 38px !important; min-height: 38px !important;
            padding: 4px 10px !important; background: #232f3e !important;
        }
        .amzn-ss-logo-subtitle, .amzn-ss-promo-slot, .amzn-ss-asin-alert-slot,
        .amzn-ss-settings, .amzn-ss-popover-preload, .amzn-ss-text-link-radio-button-container,
        #amzn-ss-txt-success-msg, #amzn-ss-txt-failure-msg, #amzn-ss-txt-update-msg,
        .amzn-ss-loading-spinner { display: none !important; }
        .amzn-ss-brand a { display: flex; align-items: center; gap: 6px; color: #fff !important; font-size: 13px !important; }
        .amzn-ss-logo-heading { font-size: 15px !important; font-weight: bold; margin: 0 !important; }
        #amzn-ss-get-link-button, #amzn-ss-get-link-btn-text { height: 30px !important; font-size: 13px !important; }
        .amzn-ss-text-textarea-container textarea { width: 100% !important; height: 60px !important; }
    `);

    let processed = false;  // 1ページにつき1回だけ処理するフラグ

    function init() {
        if (processed) return;
        const toolbar = document.querySelector('#amzn-ss-wrap, .amzn-ss-wrap');
        if (!toolbar) return;

        processed = true;  // このページではもう処理しない
        console.log('Amazonアソシエイトツールバー検出 → スリム化＆自動コピー有効化');

        // リンク生成ボタンに自動コピー機能を付与
        const addCopyHandler = () => {
            const btn = document.querySelector('#amzn-ss-get-link-button, #amzn-ss-get-link-btn-text button');
            if (!btn || btn.dataset.copyHandler) return;

            btn.dataset.copyHandler = 'true';
            btn.addEventListener('click', () => {
                setTimeout(() => {
                    const short = document.querySelector('#amzn-ss-text-shortlink-textarea');
                    const full  = document.querySelector('#amzn-ss-text-fulllink-textarea');
                    const url = (short && short.value.trim()) || (full && full.value.trim()) || '';

                    if (url && url.startsWith('http')) {
                        GM_setClipboard(url, 'text');
                        showToast('クリップボードにコピーしました');
                    }
                }, 800); // 必要に応じて700〜1000msに調整可
            });
        };

        // 初回＋動的追加に対応
        addCopyHandler();
        new MutationObserver(addCopyHandler).observe(toolbar, { childList: true, subtree: true });
    }

    // トースト通知
    function showToast(msg) {
        const toast = document.createElement('div');
        toast.textContent = msg;
        Object.assign(toast.style, {
            position: 'fixed', bottom: '20px', right: '20px', zIndex: 99999,
            background: 'rgba(35,47,62,0.95)', color: 'white', padding: '10px 18px',
            borderRadius: '6px', fontSize: '13px', boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            animation: 'tamperToast 2.8s forwards'
        });
        document.body.appendChild(toast);
        GM_addStyle('@keyframes tamperToast{0%,100%{opacity:0;transform:translateY(10px)}30%,80%{opacity:1;transform:translateY(0)}}');
        setTimeout(() => toast.remove(), 3000);
    }

    // ページ読み込み完了時と、Amazonの非同期遷移後にも実行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(init, 500));
    } else {
        setTimeout(init, 500);
    }

    // AmazonのTurbolinks風遷移にも対応
    new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.addedNodes.length) {
                // ツールバーが新しく追加されたら再初期化
                if ([...m.addedNodes].some(node => node.nodeType === 1 && node.matches && node.matches('#amzn-ss-wrap, .amzn-ss-wrap'))) {
                    processed = false;  // 新しいページ＝リセット
                    setTimeout(init, 600);
                }
            }
        }
    }).observe(document.body, { childList: true, subtree: true });

})();