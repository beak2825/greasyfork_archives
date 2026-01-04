// ==UserScript==
// @name         Ccfolia Tab Customizer
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  ココフォリアのチャットタブを3段まで折り返し表示し、選択中のタブに赤いラインを表示します。
// @author       むらひと
// @license      MIT
// @match        https://ccfolia.com/rooms/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ccfolia.com
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/557133/Ccfolia%20Tab%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/557133/Ccfolia%20Tab%20Customizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * -------------------------------------------------------------------------
     * Configuration
     * -------------------------------------------------------------------------
     */
    const CONFIG = {
        // タブ1行あたりの高さ(px)
        TAB_HEIGHT: 36,

        // 表示する最大行数
        MAX_ROWS: 3,

        // 赤いラインの太さ(px)
        LINE_WIDTH: 2,

        // ラインの色
        LINE_COLOR: '#ff0000'
    };

    // スクロールコンテナの最大高さ計算 (行数 * 高さ + 微調整用の余裕)
    const SCROLL_MAX_HEIGHT = (CONFIG.TAB_HEIGHT * CONFIG.MAX_ROWS) + 2;

    /**
     * -------------------------------------------------------------------------
     * Styles
     * -------------------------------------------------------------------------
     */
    // :is() を使用してセレクタを簡略化
    const containerSelector = ':is(.MuiDrawer-root, .MuiPaper-root)';

    const styles = `
        /* ==========================================================================
           1. Container Reset (コンテナの初期化)
           ========================================================================== */
        ${containerSelector} .MuiTabs-root,
        ${containerSelector} .MuiTabs-scroller,
        ${containerSelector} .MuiTabs-flexContainer {
            min-height: 0 !important;
            height: auto !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
        }

        /* ==========================================================================
           2. Flex Layout (折り返し設定)
           ========================================================================== */
        ${containerSelector} .MuiTabs-flexContainer {
            display: flex !important;
            flex-wrap: wrap !important;
            align-content: flex-start !important;
            justify-content: flex-start !important;
            flex-direction: row !important;
            width: 100% !important;
        }

        /* ==========================================================================
           3. Scroll Control (スクロール設定)
           ========================================================================== */
        ${containerSelector} .MuiTabs-scroller {
            display: block !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            max-height: ${SCROLL_MAX_HEIGHT}px !important;
        }

        /* ==========================================================================
           4. Tab Item Styling (タブのスタイル)
           ========================================================================== */
        ${containerSelector} .MuiTab-root {
            /* 高さ固定 */
            height: ${CONFIG.TAB_HEIGHT}px !important;
            min-height: ${CONFIG.TAB_HEIGHT}px !important;
            max-height: ${CONFIG.TAB_HEIGHT}px !important;

            /* 横幅と配置 */
            flex-grow: 1 !important;
            max-width: none !important;
            min-width: auto !important;
            box-sizing: border-box !important;

            /* 余白設定 */
            padding: 0 8px !important;
            margin: 0 !important;
            border: none !important;

            /* テキスト配置 */
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;

            /* アニメーション無効化・透過 */
            transition: none !important;
            opacity: 0.7 !important;
        }

        /* タブ内テキストラッパーのズレ防止 */
        .MuiTab-root > .MuiTab-wrapper,
        .MuiTab-root > span {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            line-height: 1 !important;
        }

        /* ==========================================================================
           5. Cleanup (不要要素の非表示)
           ========================================================================== */
        .MuiTabs-indicator,
        .MuiTabScrollButton-root {
            display: none !important;
        }

        /* ==========================================================================
           6. Selected State (選択状態の強調)
           borderを使わずbox-shadowで高さを維持したまま線を引く
           ========================================================================== */
        ${containerSelector} .MuiTab-root.Mui-selected {
            box-shadow: inset 0 -${CONFIG.LINE_WIDTH}px 0 0 ${CONFIG.LINE_COLOR} !important;
            font-weight: bold !important;
            opacity: 1 !important;
            z-index: 10 !important;
        }
    `;

    // スタイルを適用
    GM_addStyle(styles);

    console.log("Ccfolia Tab Customizer: Loaded successfully.");
})();