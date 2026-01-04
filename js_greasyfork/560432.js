// ==UserScript==
// @name         Twitch ID Search [mebuki / aimg]
// @namespace    https://github.com/uzuky
// @version      0.3
// @description  Twitch配信ページにユーザーID検索ボタンを追加します
// @match        https://www.twitch.tv/*
// @run-at       document-body
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560432/Twitch%20ID%20Search%20%5Bmebuki%20%20aimg%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/560432/Twitch%20ID%20Search%20%5Bmebuki%20%20aimg%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SELECTOR = '#live-channel-stream-information';
    const CLASS_NAME = 'open-thread';
    const log = (msg) => console.log(`[TwitchID-Tool] ${msg}`);

    // スタイル定義
    function addStyle() {
        const style = document.createElement('style');
        style.textContent = `
            .${CLASS_NAME} {
                position: absolute;
                top: 0;
                left: 0;
                font-size: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1;
                opacity: 0.2;
                transition: opacity 0.2s;
                background: rgba(169, 112, 255, 0.5);
                padding: 2px 5px;
                border-radius: 4px;
            }
            .${CLASS_NAME}:hover { opacity: 1; }
            .${CLASS_NAME} a { margin: 0 4px; text-decoration: none; cursor: pointer; }
        `;
        document.head.appendChild(style);
    }

    // メイン処理
    function run() {
        const path = location.pathname;
        if (path === '/' || path === '') return;

        const userId = path.substring(1);
        if (!/^[a-zA-Z0-9_]+$/.test(userId)) return;

        const target = document.querySelector(SELECTOR);
        if (!target || target.querySelector(`.${CLASS_NAME}`)) return;

        log(`Target found. Inserting for: ${userId}`);

        const div = document.createElement('div');
        div.className = CLASS_NAME;
        div.innerHTML = `
            <a class="mebuki_link" href="https://mebuki.moe/app/threads/search?q=tag:${userId}" target="_blank" title="めぶきでIDをタグ検索">🪴</a>
            <a class="aimg_link" href="https://nijiurachan.net/pc/search.php?q=${userId}" target="_blank" title="aimgでIDをスレ検索">🤖</a>
        `;

        // absolute配置用に親要素をrelative化
        if (getComputedStyle(target).position === 'static') {
            target.style.position = 'relative';
        }

        target.appendChild(div);
    }

    addStyle();
    run();

    // 画面遷移・DOM変化の監視
    const observer = new MutationObserver(() => run());
    observer.observe(document.body, { childList: true, subtree: true });

    log('Script started.');
})();