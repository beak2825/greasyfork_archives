// ==UserScript==
// @name         FC2ブログ ?sp remover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  fc2.comの末尾につく?spを自動で削除する
// @author       Smo920
// @match        *://*.fc2.com/*
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560261/FC2%E3%83%96%E3%83%AD%E3%82%B0%20sp%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/560261/FC2%E3%83%96%E3%83%AD%E3%82%B0%20sp%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URLの末尾が ?sp または ?sp= の場合
    if (location.search === '?sp' || location.search === '?sp=') {
        // パラメータを除いたURLにリダイレクト
        const cleanUrl = location.origin + location.pathname + location.hash;
        window.location.replace(cleanUrl);
    }
})();
