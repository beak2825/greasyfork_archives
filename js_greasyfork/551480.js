// ==UserScript==
// @name         資安素養闖關-自動填非常同意並送出
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自動選擇 非常同意 並送出答案
// @author       issac
// @match        *://isafeevent.moe.edu.tw/*
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/551480/%E8%B3%87%E5%AE%89%E7%B4%A0%E9%A4%8A%E9%97%96%E9%97%9C-%E8%87%AA%E5%8B%95%E5%A1%AB%E9%9D%9E%E5%B8%B8%E5%90%8C%E6%84%8F%E4%B8%A6%E9%80%81%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/551480/%E8%B3%87%E5%AE%89%E7%B4%A0%E9%A4%8A%E9%97%96%E9%97%9C-%E8%87%AA%E5%8B%95%E5%A1%AB%E9%9D%9E%E5%B8%B8%E5%90%8C%E6%84%8F%E4%B8%A6%E9%80%81%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function autoFillAndSubmit() {
        document.querySelectorAll("input[type=radio][value='5']").forEach(r => r.checked = true);
        let submitBtn = document.querySelector(".btnSendExam");
        if(submitBtn) submitBtn.click();
    }

    window.addEventListener('load', () => {
        setTimeout(autoFillAndSubmit, 1000); // 延遲1秒執行
    });
})();