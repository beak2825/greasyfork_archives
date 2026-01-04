// ==UserScript==
// @name         Waze URL en → ja 自動変換（クリップボード監視）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  クリップボードにWazeの英語URLをコピーすると自動で日本語URLに変換して再コピー。通知を上部中央に表示。
// @author       You
// @match        https://www.waze.com/ja/live-map/*
// @grant        GM_notification
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560190/Waze%20URL%20en%20%E2%86%92%20ja%20%E8%87%AA%E5%8B%95%E5%A4%89%E6%8F%9B%EF%BC%88%E3%82%AF%E3%83%AA%E3%83%83%E3%83%97%E3%83%9C%E3%83%BC%E3%83%89%E7%9B%A3%E8%A6%96%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/560190/Waze%20URL%20en%20%E2%86%92%20ja%20%E8%87%AA%E5%8B%95%E5%A4%89%E6%8F%9B%EF%BC%88%E3%82%AF%E3%83%AA%E3%83%83%E3%83%97%E3%83%9C%E3%83%BC%E3%83%89%E7%9B%A3%E8%A6%96%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let lastClipboard = '';

    // 通知用のスタイル（上部中央に変更）
    GM_addStyle(`
        .waze-notify {
            position: fixed;
            top: 20px;                  /* 上から20px */
            left: 50%;                  /* 左右中央 */
            transform: translateX(-50%); /* 自分の幅の半分だけ左にずらして真ん中寄せ */
            padding: 15px 30px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            font-size: 15px;
            font-family: "Meiryo", "Segoe UI", sans-serif;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            opacity: 0.95;
            max-width: 90%;
            text-align: center;
            white-space: pre-line; /* \n で改行できるように */
        }
    `);

    function showNotification(message, color, duration = 3000) {
        const div = document.createElement('div');
        div.className = 'waze-notify';
        div.textContent = message;
        div.style.backgroundColor = color;
        document.body.appendChild(div);

        // 少し遅らせて登場アニメーション（オプションで自然に）
        setTimeout(() => {
            div.style.transition = 'all 0.4s ease';
            div.style.opacity = '1';
            div.style.transform = 'translateX(-50%) translateY(0)';
        }, 100);

        setTimeout(() => {
            div.style.opacity = '0';
            div.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => div.remove(), 500);
        }, duration);
    }

    async function checkClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            if (text === lastClipboard) return;

            lastClipboard = text;
            const url = text.trim();

            if (!url) return;

            if (!url.includes('waze.com') && !url.includes('waze.to')) return;

            // /en/ が含まれる場合のみ変換
            if (url.includes('/en/') && !url.includes('/ja/')) {
                const newUrl = url.replace('/en/', '/ja/');

                await navigator.clipboard.writeText(newUrl);
                lastClipboard = newUrl;

                showNotification('✓ 変換成功！\n日本語URLをクリップボードにコピーしました', '#4CAF50', 3000);
            } else if (url.includes('/ja/')) {
                // すでに日本語の場合は軽く通知（任意）
                // showNotification('ℹ すでに日本語URLです', '#2196F3', 4000);
            }

        } catch (err) {
            // 権限エラーなどは無視（初回はユーザーの操作が必要な場合あり）
        }
    }

    // 起動時の案内通知（上部中央に表示される）
    showNotification('Waze URL変換スクリプト起動中…\n英語URLをコピーしてみてください', '#2196F3', 3000);

    setInterval(checkClipboard, 800);
    window.addEventListener('focus', checkClipboard);

})();

