// ==UserScript==
// @name         Auto Popup Killer FANZA GAMES
// @version      1.0
// @description  FANZA GAMESのポップアップを自動的に閉じる
// @match        https://dlsoft.dmm.co.jp/*
// @run-at       document-idle
// @grant        none
// @namespace    shino-tools
// @license CC0-1.0
// @downloadURL https://update.greasyfork.org/scripts/555692/Auto%20Popup%20Killer%20FANZA%20GAMES.user.js
// @updateURL https://update.greasyfork.org/scripts/555692/Auto%20Popup%20Killer%20FANZA%20GAMES.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 監視を続ける最大時間（ms）
    const MAX_DURATION = 60 * 1000;
    const INTERVAL = 500;

    function closePopupsOnce() {
        try {
            // 大ポップアップ（.fn-popup.is-show 内の .fn-close）
            document.querySelectorAll('.fn-popup.is-show .fn-close').forEach((el) => {
                if (el.offsetParent !== null) {
                    el.dispatchEvent(new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true
                    }));
                }
            });

            // 右下追従バナー（.pcgame-popin 内の .bt-close）
            document.querySelectorAll('.pcgame-popin .bt-close').forEach((el) => {
                if (el.offsetParent !== null) {
                    el.dispatchEvent(new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true
                    }));
                }
            });
        } catch (e) {
            console.log('Popup auto close error:', e);
        }
    }

    // 一定時間だけ定期的に実行（遅れて出るポップアップ対策）
    const start = Date.now();
    const timer = setInterval(() => {
        closePopupsOnce();
        if (Date.now() - start > MAX_DURATION) {
            clearInterval(timer);
        }
    }, INTERVAL);

    // DOM変化も監視して、そのたびに閉じる
    const observer = new MutationObserver(() => {
        closePopupsOnce();
    });

    observer.observe(document.documentElement || document.body, {
        childList: true,
        subtree: true
    });

    setTimeout(() => {
        observer.disconnect();
    }, MAX_DURATION);
})();
