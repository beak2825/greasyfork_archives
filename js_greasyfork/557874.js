// ==UserScript==
// @name         Github 时间显示格式（YYYY/MM/DD HH:MM）
// @namespace    https://h3110w0r1d.com/
// @version      1.0.1
// @description  将 Github 的时间转换为其他格式（YYYY/MM/DD HH:MM）
// @author       h3110w0r1d
// @license MIT
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/557874/Github%20%E6%97%B6%E9%97%B4%E6%98%BE%E7%A4%BA%E6%A0%BC%E5%BC%8F%EF%BC%88YYYYMMDD%20HH%3AMM%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/557874/Github%20%E6%97%B6%E9%97%B4%E6%98%BE%E7%A4%BA%E6%A0%BC%E5%BC%8F%EF%BC%88YYYYMMDD%20HH%3AMM%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';
    setInterval(function(){
        document.querySelectorAll('relative-time:not([data-24h-processed])').forEach((item) => {
            // 设置一个标记，防止重复处理
            item.setAttribute('data-24h-processed', 'true');

            // 采用 'zh-CN' (中国大陆) locale，它默认使用 24 小时制和 'YYYY/MM/DD' 格式。
            // 无法直接控制分隔符为 '-'，但格式是正确的。
            item.setAttribute("lang", "zh-CN");
            item.setAttribute("format", "datetime");

            // 设置日期部分
            item.setAttribute("year", "numeric");
            item.setAttribute("month", "2-digit");
            item.setAttribute("day", "2-digit");

            // 设置时间部分 (24H)
            item.setAttribute("hour", "2-digit");
            item.setAttribute("minute", "2-digit");
            item.setAttribute("second", "2-digit");

            // 禁用不必要的元素
            item.setAttribute("weekday", "");
            item.setAttribute("hour12", "false"); // 显式禁用 12 小时制（虽然 zh-CN 通常默认禁用）
        });
    }, 1000);
})();