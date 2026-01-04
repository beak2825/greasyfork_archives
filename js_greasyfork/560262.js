// ==UserScript==
// @name         近鉄駅時刻表 /sp Remover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  /spを自動で削除して通常ページにリダイレクトする
// @author       Smo920
// @match        https://eki.kintetsu.co.jp/norikae/sp*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560262/%E8%BF%91%E9%89%84%E9%A7%85%E6%99%82%E5%88%BB%E8%A1%A8%20sp%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/560262/%E8%BF%91%E9%89%84%E9%A7%85%E6%99%82%E5%88%BB%E8%A1%A8%20sp%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // /sp を削除してリダイレクト
    const newUrl = window.location.href.replace('/sp', '');
    if (newUrl !== window.location.href) {
        window.location.replace(newUrl);
    }
})();
