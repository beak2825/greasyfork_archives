// ==UserScript==
// @name         更好的数字
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  将大于 1000 的数字进位显示，支持 K/M/B，每 2 秒刷新一次，可以修改 updateTime。
// @author       jxxzs
// @match        https://www.milkywayidle.com/game*
// @grant        none
// @run-at       document-idle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/550362/%E6%9B%B4%E5%A5%BD%E7%9A%84%E6%95%B0%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/550362/%E6%9B%B4%E5%A5%BD%E7%9A%84%E6%95%B0%E5%AD%97.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    const updateTime = 2;

    function FormatTextNode(node) {
        if (!node || !/\d/.test(node.nodeValue)) return;

        const units = ["", "K", "M", "B"];
        let text = node.nodeValue;

        let replaced = text.replace(/\b(\d+(?:\.\d+)?)([KMB]?)\b/g, (match, numStr, unit) => {
            let num = parseFloat(numStr);
            let index = units.indexOf(unit);

            if (index === -1) return match; // 非法单位直接返回

            // 转换成实际数值
            let value = num * Math.pow(1000, index);

            if (value < 1000) return match;

            let newIndex = 0;
            while (value >= 1000 && newIndex < units.length - 1) {
                value /= 1000;
                newIndex++;
            }

            // <10 保留 1 位小数；>=10 取整
            let formatted = value >= 10 ? Math.round(value) : value.toFixed(2);

            return formatted + units[newIndex];
        });

        if (replaced !== text) {
            node.nodeValue = replaced;
        }
    }

    function FormatNumbersInPage(root = document.body) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = walker.nextNode())) {
            FormatTextNode(node);
        }
    }

    function StartPeriodicFormatter() {
        // 初次执行
        FormatNumbersInPage();

        // 每 2 秒执行一次
        setInterval(() => {
            FormatNumbersInPage();
        }, updateTime * 1000);

        console.log("[BetterNumbers] 已启动，每 2s 扫描一次 ✅");
    }

    // 主逻辑
    (async () => {
        StartPeriodicFormatter();
    })();
})();
