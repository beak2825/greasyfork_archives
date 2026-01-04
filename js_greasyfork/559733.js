// ==UserScript==
// @name         Kickレイド自動拒否
// @namespace    http://tampermonkey.net/
// @version      2025-3-19
// @description  拒否ボタン監視し自動で押すだけ
// @author       DSBM
// @match        https://kick.com/*
// @icon    　 　https://www.google.com/s2/favicons?sz=64&domain=kick.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/559733/Kick%E3%83%AC%E3%82%A4%E3%83%89%E8%87%AA%E5%8B%95%E6%8B%92%E5%90%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/559733/Kick%E3%83%AC%E3%82%A4%E3%83%89%E8%87%AA%E5%8B%95%E6%8B%92%E5%90%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';


const autoClick = setInterval(() => {
    const targetText = "拒否";
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes(targetText));

    if (btn) {
        btn.click();
        console.log("クリック成功");
        clearInterval(autoClick); // クリックしたら停止
    }
}, 3000); // 3秒ごとにチェック
})();
