// ==UserScript==
// @name         資安素養闖關-自動按下繼續挑戰按鈕
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自動按下頁面上的「繼續挑戰」按鈕
// @author       issac
// @match        *://isafeevent.moe.edu.tw/*
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/551483/%E8%B3%87%E5%AE%89%E7%B4%A0%E9%A4%8A%E9%97%96%E9%97%9C-%E8%87%AA%E5%8B%95%E6%8C%89%E4%B8%8B%E7%B9%BC%E7%BA%8C%E6%8C%91%E6%88%B0%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/551483/%E8%B3%87%E5%AE%89%E7%B4%A0%E9%A4%8A%E9%97%96%E9%97%9C-%E8%87%AA%E5%8B%95%E6%8C%89%E4%B8%8B%E7%B9%BC%E7%BA%8C%E6%8C%91%E6%88%B0%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickContinueChallenge() {
        let btn = document.querySelector(".btnStartExam");
        if (btn) {

            btn.click();
        }
    }

    // 每隔 500 毫秒檢查一次，直到找到按鈕
    setInterval(clickContinueChallenge, 500);
})();