// ==UserScript==
// @name         Google Search Tab-to-Arrow
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Google検索の検索候補をTabキーで選択します。Tabを下矢印キー、Shift+Tabを上矢印キーの動作に変換します。
// @author       null
// @match        https://www.google.com/*
// @match        https://www.google.co.jp/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552511/Google%20Search%20Tab-to-Arrow.user.js
// @updateURL https://update.greasyfork.org/scripts/552511/Google%20Search%20Tab-to-Arrow.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const searchInput = document.querySelector('textarea[name="q"], input[name="q"]');

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener('keydown', function(e) {
        if (e.key !== 'Tab') {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        const keyToSimulate = e.shiftKey ? 'ArrowUp' : 'ArrowDown';

        searchInput.dispatchEvent(new KeyboardEvent('keydown', {
            key: keyToSimulate,
            keyCode: keyToSimulate === 'ArrowUp' ? 38 : 40,
            bubbles: true,
            cancelable: true
        }));

    }, true); // イベントを先に捕捉するためにキャプチャフェーズで実行

})();