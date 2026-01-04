// ==UserScript==
// @name         Auto Replace Ticket Name and Expiry Date (safe)
// @namespace    https://greasyfork.org/users/yourname
// @version      1.5
// @description  修改电子票页面的姓名和期满日期（优化：防止阻塞网页、死循环）
// @author       You
// @match        *://*.interpark.com/*
// @match        *://*.interparkglobal.com/*
// @match        *://m.interpark.com/*
// @match        *://m.interparkglobal.com/*
// @icon         https://interpark.com/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548584/Auto%20Replace%20Ticket%20Name%20and%20Expiry%20Date%20%28safe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/548584/Auto%20Replace%20Ticket%20Name%20and%20Expiry%20Date%20%28safe%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const oldName = "ZHANG YIWEN";
    const newName = "ZHANG TEST";
    const newDate = "2040-12-31"; // 目标日期

    const dateRegex = /\d{4}-\d{2}-\d{2}/g;

    function replaceNameAndDate() {
        document.querySelectorAll("div.mbs_4").forEach(el => {
            let html = el.innerHTML;

            // 如果已经替换过，就不再重复修改，避免死循环
            if (html.includes(newName) && html.includes(newDate)) {
                return;
            }

            let changed = false;

            // 替换名字
            if (html.includes(oldName)) {
                html = html.replaceAll(oldName, newName);
                changed = true;
            }

            // 替换日期
            if (dateRegex.test(html)) {
                html = html.replace(dateRegex, newDate);
                changed = true;
            }

            if (changed) {
                el.innerHTML = html;
            }
        });
    }

    window.addEventListener("load", () => {
        replaceNameAndDate();
        setTimeout(replaceNameAndDate, 1000);

        const observer = new MutationObserver(() => replaceNameAndDate());
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
