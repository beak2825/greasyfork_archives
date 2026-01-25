// ==UserScript==
// @name         POE Trade Fuzzy Search - JP IME Fix (Search Only)
// @namespace    https://github.com/JonasRock/POETradeFuzzySearch
// @version      1.3.0
// @description  検索窓のみにチルダを付与。価格入力欄などの誤動作を防ぎ、日本語入力の重複と全角スペースも修正します。
// @author       Gemini (Original by JonasRock)
// @match        https://jp.pathofexile.com/trade*
// @match        https://www.pathofexile.com/trade*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pathofexile.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563921/POE%20Trade%20Fuzzy%20Search%20-%20JP%20IME%20Fix%20%28Search%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/563921/POE%20Trade%20Fuzzy%20Search%20-%20JP%20IME%20Fix%20%28Search%20Only%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isComposing = false;

    document.addEventListener('compositionstart', () => { isComposing = true; });
    document.addEventListener('compositionend', (e) => {
        isComposing = false;
        setTimeout(() => applyFuzzy(e.target), 30);
    });

    document.addEventListener('input', (e) => {
        if (isComposing) return;
        applyFuzzy(e.target);
    }, true);

    function applyFuzzy(target) {
        if (target.tagName !== 'INPUT' || target.type !== 'text') return;

        // 【ここが重要：検索窓（Stat Filter）かどうかを判定】
        // トレードサイトのステータス検索欄は、親要素に特定のクラスや構造を持っています。
        // placeholderの内容やクラス名で「検索窓」のみを特定します。
        const isSearchField = target.closest('.filter-group-body') || 
                            target.classList.contains('multiselect__input') ||
                            (target.placeholder && target.placeholder.includes('...'));
        
        // 価格入力欄（Min/Maxなど）や、検索窓以外には何もしない
        if (!isSearchField) return;

        let val = target.value;
        if (!val) return;

        let changed = false;

        // 1. 全角スペースを半角に置換
        if (val.includes('　')) {
            val = val.replace(/　/g, ' ');
            changed = true;
        }

        // 2. ~ 付与の判定
        const skipTilde = val.startsWith('~') || val.startsWith(' ') || /^\d/.test(val);

        if (!skipTilde) {
            // IME重複ゴミ削除
            if (val.length >= 2) {
                const first = val[0];
                const second = val[1];
                if (/^[a-zA-Z]$/.test(first) && second.charCodeAt(0) > 255) {
                    val = val.substring(1);
                }
            }
            val = '~' + val;
            changed = true;
        }

        if (changed || target.value !== val) {
            const start = target.selectionStart;
            target.value = val;
            target.dispatchEvent(new Event('input', { bubbles: true }));
            const offset = (!skipTilde && changed) ? 1 : 0;
            target.setSelectionRange(start + offset, start + offset);
        }
    }
})();