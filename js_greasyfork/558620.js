// ==UserScript==
// @name         Niconico Comment Font Force
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Force niconico comments to use custom font + weight/style
// @match        https://live.nicovideo.jp/*
// @match        https://www.nicovideo.jp/*
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/558620/Niconico%20Comment%20Font%20Force.user.js
// @updateURL https://update.greasyfork.org/scripts/558620/Niconico%20Comment%20Font%20Force.meta.js
// ==/UserScript==

(function() {
    "use strict";

    /* -------------------------
     *  ★ ユーザー設定 ここから
     * ------------------------- */

    // フォント名（複数候補OK）
    const FONT_FAMILY = `HiramaruAA, "HiraMaruProN-W4", "Hiragino Maru Gothic ProN", sans-serif`;

    // フォントサイズの倍率（1.0 = 元の大きさ）
    const FONT_SIZE_SCALE = 1.0;

    // フォントの色（CSS 色指定）
    const FONT_COLOR = "#ffffff";

    // ▼追加：文字の太さ・スタイル
    const FONT_WEIGHT = "normal"; // normal | bold
    const FONT_STYLE = "normal"; // normal | italic

    /* -------------------------
     *  ★ ユーザー設定 ここまで
     * ------------------------- */


    /* ============================================================
       Canvas の font を書き換える
       ============================================================ */

    const fontDesc = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, "font");
    if (!fontDesc) return;

    Object.defineProperty(CanvasRenderingContext2D.prototype, "font", {
        set(value) {

            // --- 元のサイズを取得 ---
            const sizeMatch = value.match(/(\d+(\.\d+)?)px/i);
            const origSize = sizeMatch ? parseFloat(sizeMatch[1]) : 20;
            const newSize = (origSize * FONT_SIZE_SCALE) + "px";

            // ---- 元の font を構造解析 ----
            // "italic bold 24px sans-serif" → ["italic", "bold"]
            const hasBold = /\bbold\b/i.test(value);
            const hasItalic = /\bitalic\b/i.test(value);

            // ---- スタイル構築 ----
            const finalStyle = FONT_STYLE;
            const finalWeight = FONT_WEIGHT;

            // ---- 最終フォント ----
            const forcedFont =
                `${finalStyle} ${finalWeight} ${newSize} ${FONT_FAMILY}`;

            fontDesc.set.call(this, forcedFont);
        },
        get: fontDesc.get
    });


    /* ============================================================
       fillStyle (色) を固定する
       ============================================================ */

    const fillStyleDesc = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, "fillStyle");
    if (fillStyleDesc) {
        Object.defineProperty(CanvasRenderingContext2D.prototype, "fillStyle", {
            set(value) {
                fillStyleDesc.set.call(this, FONT_COLOR);
            },
            get: fillStyleDesc.get
        });
    }

})();
