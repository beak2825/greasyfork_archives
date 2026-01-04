// ==UserScript==
// @name         員工出勤狀況日報表-自動點擊按鈕
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自動展開本營運處位置
// @author       shanlan(grok-4-fast-reasoning)
// @match        https://hris.cht.com.tw/Wams/Statistic/StatisticQuery.aspx
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560267/%E5%93%A1%E5%B7%A5%E5%87%BA%E5%8B%A4%E7%8B%80%E6%B3%81%E6%97%A5%E5%A0%B1%E8%A1%A8-%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/560267/%E5%93%A1%E5%B7%A5%E5%87%BA%E5%8B%A4%E7%8B%80%E6%B3%81%E6%97%A5%E5%A0%B1%E8%A1%A8-%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var txtUnit = document.getElementById('Content_Main_StatisticUnit1_txtUnit');
    if (txtUnit && txtUnit.value === '臺南營運處') return;
    var btn = document.getElementById('Content_Main_StatisticUnit1_btnShowTree');
    if (btn) btn.click();
    var observer = new MutationObserver(function(mutations) {
        var link = document.getElementById('Content_Main_StatisticUnit1_TreeView1t0');
        if (link) {
            link.click();
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();