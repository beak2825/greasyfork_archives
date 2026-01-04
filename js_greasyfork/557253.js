// ==UserScript==
// @name         あいもげ高速スクロール(仮)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  あいもげで既読位置までスクロールする機能を高速化します
// @author       AI
// @match        https://nijiurachan.net/pc/thread.php*
// @run-at       document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557253/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E9%AB%98%E9%80%9F%E3%82%B9%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%AB%28%E4%BB%AE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557253/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E9%AB%98%E9%80%9F%E3%82%B9%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%AB%28%E4%BB%AE%29.meta.js
// ==/UserScript==

(function() {
    "use strict";

    console.log("[aimg-scroll] スクリプト開始");

    if (window.__aimgScrollInitialized) {
        return;
    }
    window.__aimgScrollInitialized = true;

    // ----- ストレージキー -----
    const threadId = new URLSearchParams(window.location.search).get('id') || location.pathname;
    const storageKey = `aimg_scrollY_${threadId}`;
    const lastY = localStorage.getItem(storageKey);

    console.log("[aimg-scroll] スレッドID: " + threadId);
    console.log("[aimg-scroll] 保存値: " + lastY + "px");

    // ----- CSSでポップアップ非表示 -----
    const style = document.createElement('style');
    style.textContent = `
        div[style*="position: fixed"][style*="right: 20px"] {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    // ----- setTimeout をフック(aimgの遅延スクロール無効化) -----
    const originalSetTimeout = window.setTimeout;
    window.setTimeout = function(fn, delay, ...args) {
        if (typeof delay === 'number' && delay >= 2000 && delay <= 4000) {
            console.log("[aimg-scroll] aimgのタイマーをキャンセル(遅延: " + delay + "ms)");
            return originalSetTimeout(function() {}, 999999);
        }
        return originalSetTimeout(fn, delay, ...args);
    };

    // ----- スクロール復元 -----
    function restoreScroll() {
        if (!lastY || isNaN(lastY) || parseInt(lastY, 10) <= 0) {
            return true;
        }

        const targetY = parseInt(lastY, 10);
        const docHeight = Math.max(
            document.body ? document.body.scrollHeight : 0,
            document.documentElement ? document.documentElement.scrollHeight : 0
        );

        if (docHeight >= targetY || docHeight >= targetY * 0.9) {
            console.log("[aimg-scroll] スクロール実行: " + targetY + "px (ページ高さ: " + docHeight + "px)");
            window.scrollTo(0, targetY);
            return true;
        }

        return false;
    }

    // ----- 即座にスクロール試行 -----
    if (!restoreScroll() && lastY && parseInt(lastY, 10) > 0) {
        let attempts = 0;
        const maxAttempts = 200;
        let lastHeight = 0;
        let stableCount = 0;
        let hasSeenGrowth = false;

        const waitInterval = setInterval(function() {
            attempts++;
            const currentHeight = Math.max(
                document.body ? document.body.scrollHeight : 0,
                document.documentElement ? document.documentElement.scrollHeight : 0
            );

            if (currentHeight > lastHeight) {
                hasSeenGrowth = true;
                stableCount = 0;
                lastHeight = currentHeight;
                console.log("[aimg-scroll] ページ成長: " + currentHeight + "px (試行: " + attempts + ")");
            } else if (currentHeight === lastHeight) {
                stableCount++;
            }

            const success = restoreScroll();

            if (success) {
                clearInterval(waitInterval);
                console.log("[aimg-scroll] スクロール成功 (試行回数: " + attempts + ")");
            } else if (attempts >= maxAttempts) {
                clearInterval(waitInterval);
                console.log("[aimg-scroll] タイムアウト: 強制スクロール (試行: " + attempts + ", 高さ: " + currentHeight + "px)");
                window.scrollTo(0, Math.min(parseInt(lastY, 10), currentHeight));
            } else if (hasSeenGrowth && stableCount >= 10) {
                clearInterval(waitInterval);
                console.log("[aimg-scroll] ページ読み込み完了: スクロール (高さ: " + currentHeight + "px)");
                window.scrollTo(0, Math.min(parseInt(lastY, 10), currentHeight));
            }
        }, 100);
    }

    // ----- スクロール位置を保存 -----
    let saveTimer;
    window.addEventListener("scroll", function() {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(function() {
            const currentY = window.scrollY || window.pageYOffset;
            if (currentY > 0) {
                localStorage.setItem(storageKey, currentY);
            }
        }, 200);
    }, { passive: true });

    // ----- ページ離脱時に保存 -----
    window.addEventListener("beforeunload", function() {
        clearTimeout(saveTimer);
        const currentY = window.scrollY || window.pageYOffset;
        if (currentY > 0) {
            localStorage.setItem(storageKey, currentY);
            console.log("[aimg-scroll] 最終保存: " + currentY + "px");
        }
    });

    // ----- ポップアップ削除 -----
    setTimeout(function() {
        const div = document.querySelector('div[style*="position: fixed"][style*="right: 20px"]');
        if (div && div.textContent.includes("前回の位置から再開")) {
            div.remove();
            console.log("[aimg-scroll] ポップアップ削除");
        }
    }, 300);

    console.log("[aimg-scroll] 初期化完了");

})();
