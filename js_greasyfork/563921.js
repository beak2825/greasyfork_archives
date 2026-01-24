// ==UserScript==
// @name         POE Trade Fuzzy Search - JP IME Fix
// @namespace    https://github.com/JonasRock/POETradeFuzzySearch
// @version      1.1.0
// @description  Path of Exileのトレードサイトで、日本語入力時に「~ｈへんかん」のように1文字目が重複する不具合を修正し、自動で「~」を付与してあいまい検索を有効にします。
// @author       Gemini (Original by JonasRock)
// @match        https://jp.pathofexile.com/trade*
// @match        https://www.pathofexile.com/trade*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pathofexile.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563921/POE%20Trade%20Fuzzy%20Search%20-%20JP%20IME%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/563921/POE%20Trade%20Fuzzy%20Search%20-%20JP%20IME%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * このスクリプトは JonasRock 氏の POETradeFuzzySearch をベースに、
     * 日本語 IME 環境での挙動を最適化したものです。
     * * 修正点:
     * 1. IME入力中（未確定状態）の自動挿入を停止
     * 2. 確定時の重複文字（~hへんかん の 'h'）を自動クリーニング
     * 3. jp.pathofexile.com ドメインへの対応
     */

    let isComposing = false;

    // IME入力を監視
    document.addEventListener('compositionstart', () => { isComposing = true; });
    document.addEventListener('compositionend', (e) => {
        isComposing = false;
        // 確定直後に少し待ってから実行（サイト側の反映との競合回避）
        setTimeout(() => applyFuzzy(e.target), 30);
    });

    // 入力イベント（半角入力用）
    document.addEventListener('input', (e) => {
        if (isComposing) return;
        applyFuzzy(e.target);
    }, true);

    function applyFuzzy(target) {
        // トレードサイトの検索入力欄のみを対象にする
        if (target.tagName !== 'INPUT' || target.type !== 'text') return;
        
        let val = target.value;

        // 以下の場合は処理をスキップ:
        // 空、既に「~」がある、スペース開始、数字（価格指定など）
        if (!val || val.startsWith('~') || val.startsWith(' ') || /^\d/.test(val)) return;

        // 【IME重複ゴミの削除ロジック】
        // 「hへんかん」のように、先頭が英字1文字＋日本語になっている場合のゴミを除去
        if (val.length >= 2) {
            const first = val[0];
            const second = val[1];
            // 1文字目が半角英字、かつ2文字目が全角文字（日本語）の場合、1文字目をカット
            if (/^[a-zA-Z]$/.test(first) && second.charCodeAt(0) > 255) {
                val = val.substring(1);
            }
        }

        // 新しい値を設定（先頭にチルダを付加）
        const start = target.selectionStart;
        target.value = '~' + val;

        // PoEの検索システム(React)に変更を通知するためのイベントを発火
        const event = new Event('input', { bubbles: true });
        target.dispatchEvent(event);

        // カーソル位置を元の位置（+1）に復元
        target.setSelectionRange(start + 1, start + 1);
    }
})();