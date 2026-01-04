// ==UserScript==
// @name             Flow Chat for YouTube Live - 全画面表示修正
// @name:en          Flow Chat for YouTube Live - Fullscreen Fix
// @namespace        http://tampermonkey.net/
// @version          1.1
// @description      全画面表示時にチャット欄を強制的に非表示にしつつデータの読み込みは維持します。
// @description:en   Fixes the aspect ratio and keeps chat data loading in fullscreen for overlay use.
// @author           YourName
// @match            https://www.youtube.com/*
// @icon             https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant            GM_addStyle
// @run-at           document-start
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/561373/Flow%20Chat%20for%20YouTube%20Live%20-%20%E5%85%A8%E7%94%BB%E9%9D%A2%E8%A1%A8%E7%A4%BA%E4%BF%AE%E6%AD%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/561373/Flow%20Chat%20for%20YouTube%20Live%20-%20%E5%85%A8%E7%94%BB%E9%9D%A2%E8%A1%A8%E7%A4%BA%E4%BF%AE%E6%AD%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSSコード
    const css = `
    /* =================================================================
       YouTube 全画面表示修正パッチ (Flowchat互換 - アスペクト比修正)
       ================================================================= */

    /* 1. グローバル状態の検知：プレーヤーが全画面モード (.ytp-fullscreen) になった場合 */
    html:has(.html5-video-player.ytp-fullscreen) ytd-watch-flexy {
        width: 100vw !important;
        max-width: 100vw !important;
        min-width: 100vw !important;
        --ytd-watch-flexy-sidebar-width: 0px !important;
        --ytd-watch-flexy-sidebar-min-width: 0px !important;
        margin: 0 !important;
        padding: 0 !important;
    }

    html:has(.html5-video-player.ytp-fullscreen) ytd-watch-flexy #columns {
        width: 100vw !important;
        max-width: 100vw !important;
        margin: 0 !important;
        padding: 0 !important;
        display: block !important;
    }

    html:has(.html5-video-player.ytp-fullscreen) ytd-watch-flexy #primary {
        width: 100vw !important;
        max-width: 100vw !important;
        min-width: 100vw !important;
        padding: 0 !important;
        margin: 0 !important;
        flex: none !important;
    }

    /* 重要：チャット欄は非表示にするが、機能（データ取得）は維持する */
    html:has(.html5-video-player.ytp-fullscreen) ytd-watch-flexy #secondary {
        position: fixed !important;
        top: 0 !important;
        left: 100vw !important; /* 画面外へ配置 */
        width: 300px !important;
        height: 100vh !important;
        visibility: visible !important;
        opacity: 0 !important;
        z-index: -9999 !important;
        pointer-events: none !important;
    }

    /* --- ステップ5：プレーヤーコンテナと動画アスペクト比の修正（主要変更点） --- */

    /* 1. 最外層のコンテナが画面全体を埋めるように強制する */
    html:has(.html5-video-player.ytp-fullscreen) #player-full-bleed-container,
    html:has(.html5-video-player.ytp-fullscreen) .html5-video-container {
        width: 100vw !important;
        height: 100vh !important;
        left: 0 !important;
        top: 0 !important;
        margin: 0 !important;
    }

    /* 2. 動画本体：アスペクト比を強制的に維持 (object-fit: contain) */
    html:has(.html5-video-player.ytp-fullscreen) video {
        width: 100% !important;
        height: 100% !important;
        left: 0 !important;
        top: 0 !important;

        /* 修正の要：
           contain = アスペクト比を維持しつつ、コンテンツを枠に合わせて収める。
           比率が一致しない場合は黒帯が表示される。
           これにより、16:10モニター等で映像が断ち切られる（クロップされる）問題を解決。
        */
        object-fit: contain !important;
    }
    `;

    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
    } else {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

})();