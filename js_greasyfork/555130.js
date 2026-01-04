// ==UserScript==
// @name         Auto Popup Killer InuHK
// @version      0.2
// @description  「アカウント登録のお願い」ポップアップの「閉じる」ボタンを自動でクリックします。
// @match        *://news.web.nhk/*
// @match        *://*.nhk.or.jp/*
// @match        *://*.nhk.jp/*
// @run-at       document-idle
// @grant        none
// @namespace    shino-tools
// @license CC0-1.0
// @downloadURL https://update.greasyfork.org/scripts/555130/Auto%20Popup%20Killer%20InuHK.user.js
// @updateURL https://update.greasyfork.org/scripts/555130/Auto%20Popup%20Killer%20InuHK.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let alreadyClosed = false;
    let observer = null;
    let initialized = false;

    function findAndClickCloseButton() {
        if (alreadyClosed) return;

        const containers = Array.from(
            document.querySelectorAll('div, section, article, dialog')
        );

        for (const el of containers) {
            const text = (el.textContent || '').replace(/\s+/g, ' ');

            // 「NHK ONE アカウント登録のお願い」を含む要素に絞る
            if (!/NHK\s*ONE.*アカウント登録のお願い/.test(text)) {
                continue;
            }

            // その中の「閉じる」ボタンらしき要素を探す
            const buttons = el.querySelectorAll('button, [role="button"], a');

            for (const btn of buttons) {
                const labelText =
                    (btn.textContent ||
                        btn.getAttribute('aria-label') ||
                        '').trim();

                if (
                    labelText.includes('閉じる') ||
                    labelText.includes('とじる') ||
                    labelText.toLowerCase().includes('close')
                ) {
                    // 実際のクリック
                    btn.click();
                    alreadyClosed = true;

                    if (observer) {
                        observer.disconnect();
                    }
                    return;
                }
            }
        }
    }

    function init() {
        if (initialized) return;
        initialized = true;

        // ページロード完了後に一度チェック
        findAndClickCloseButton();

        // 動的にポップアップが出るケースに備えて監視
        observer = new MutationObserver(() => {
            findAndClickCloseButton();
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
        });

        // 念押しで少し遅らせて再チェック
        setTimeout(findAndClickCloseButton, 1000);
        setTimeout(findAndClickCloseButton, 3000);
        setTimeout(findAndClickCloseButton, 5000);
    }

    // @run-at document-idle にしているので、基本的には DOM 構築も完了後に呼ばれますが、
    // 念のため readyState を見てロード完了後に初期化しています。
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();
