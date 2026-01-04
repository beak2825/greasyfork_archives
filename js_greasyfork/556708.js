// ==UserScript==
// @name         YouTube Fullscreen Chat Hider
// @name:en      YouTube Fullscreen Chat Hider
// @namespace    https://greasyfork.org/ja/scripts/556708-youtube-fullscreen-chat-hider
// @version      1.0
// @description  YouTubeの全画面表示時に、チャットのデータ取得機能を維持したままチャット領域を完全に非表示にし、動画領域を画面いっぱいに拡大します。
// @description:en This script completely hides the chat area when YouTube is in fullscreen mode, expanding the video viewing area to fill the screen.
// @author       Daito_Amemiya
// @match        *://*.youtube.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556708/YouTube%20Fullscreen%20Chat%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/556708/YouTube%20Fullscreen%20Chat%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        /* 全画面表示中（ytd-watch-flexy[fullscreen]）のスタイルを適用 */

        /* 1. 黒い領域を生成している最上位のコンテナを完全に非表示にする */
        /* #panels-full-bleed-container が動画の幅を制限している可能性が最も高い */
        ytd-watch-flexy[fullscreen] #panels-full-bleed-container {
            display: none !important;
        }

        /* 2. チャットと右側サイドバーのコンテナも完全に非表示にする（安全策） */
        ytd-watch-flexy[fullscreen] #secondary,
        ytd-watch-flexy[fullscreen] #secondary-inner,
        ytd-watch-flexy[fullscreen] #chat-container,
        ytd-watch-flexy[fullscreen] #panels {
            display: none !important;
            width: 0 !important;
            min-width: 0 !important;
        }

        /* 3. 動画の幅を制限している可能性のある最上位のレイアウト要素の制限を解除 */
        ytd-watch-flexy[fullscreen] #columns,
        ytd-watch-flexy[fullscreen] #page-manager {
            width: 100% !important;
            max-width: none !important;
        }

        /* 4. メインの動画プレイヤー領域を強制的に画面いっぱいに広げる */
        ytd-watch-flexy[fullscreen] #primary,
        ytd-watch-flexy[fullscreen] #primary-inner {
            width: 100% !important;
            max-width: none !important;
            margin-right: 0 !important;
        }
    `);
})();